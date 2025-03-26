from django.shortcuts import render
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework import status
from .serializers import CustomerSerializer, MyTokenObtainPairSerializer, CategorySerializer, PlantSerializer, ImageSerializer, OrderSerializer, OrderItemSerializer, ShippingAddressSerializer
from rest_framework_simplejwt.views import TokenObtainPairView
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework.permissions import AllowAny, IsAuthenticated
from .models import Plant, Category, Order, OrderItem, ShippingAddress, Image, Customer
from django.db import transaction


# function-based view to register new customers
@api_view(['POST'])
@permission_classes([AllowAny])
def register_customer(request):
  serializer = CustomerSerializer(data=request.data)
  if serializer.is_valid():
    serializer.save()
    return Response(serializer.data, status=status.HTTP_201_CREATED)
  return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


# class-based view to handle user login and generate access + refresh tokens
class MyTokenObtainPairView(TokenObtainPairView):
  serializer_class = MyTokenObtainPairSerializer


# function-based view to handle user logout (delete/blacklist refresh tokens)
@api_view(['POST'])
@permission_classes([IsAuthenticated])
def logout_customer(request):
  try:
    refresh_token = request.data['refresh_token']
    token = RefreshToken(refresh_token)
    token.blacklist()
    return Response(status=status.HTTP_205_RESET_CONTENT)
  except Exception as err:
    return Response({'error': str(err)}, status=status.HTTP_400_BAD_REQUEST)


# function-based view to display all plants
@api_view(['GET'])
def plant_list(request):
  plants = Plant.objects.all()
  serializer = PlantSerializer(plants, many=True, context={'request': request})
  return Response(serializer.data, status=status.HTTP_200_OK)


# function-based view to display plant details (1 plant)
@api_view(['GET'])
def plant_details(request, pk):
  try:
    plant = Plant.objects.get(pk=pk)
    serializer = PlantSerializer(plant)
    return Response(serializer.data, status=status.HTTP_200_OK)
  except Plant.DoesNotExist:
    return Response({'error': 'Plant not found.'}, status=status.HTTP_404_NOT_FOUND)


# function-based view to display plant categories
@api_view(['GET'])
def category_list(request):
  categories = Category.objects.all()
  serializer = CategorySerializer(categories, many=True)
  return Response(serializer.data, status=status.HTTP_200_OK)


# function-based view to display customer's order(s) with order items
@api_view(['GET'])
def order_list(request):
  orders = Order.objects.all()
  serializer = OrderSerializer(orders, many=True)
  return Response(serializer.data, status=status.HTTP_200_OK)


# function-based view to display the products in customer's cart
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def view_cart(request):
  try:
    customer = request.user.customer
    order, created = Order.objects.get_or_create(customer=customer, complete=False)
    order_items = order.orderitem_set.all()
    serializer = OrderItemSerializer(order_items, many=True)
    return Response(serializer.data, status=status.HTTP_200_OK)
  except Exception as err:
    return Response({'error': str(err)}, status=status.HTTP_400_BAD_REQUEST)


# function-based view to add items to cart
@api_view(['POST'])
@permission_classes([IsAuthenticated])
def add_to_cart(request, plant_id):
  try:
    customer = request.user.customer
    plant = Plant.objects.get(pk=plant_id)
    if plant.is_available:
      order, created = Order.objects.get_or_create(customer=customer, complete=False)
      order_item, item_created = OrderItem.objects.get_or_create(order=order, plant=plant)

      if not item_created:
        order_item.quantity += 1
        order_item.save()

      return Response(status=status.HTTP_201_CREATED)
  except Plant.DoesNotExist:
    return Response({'error': 'Plant not found.'}, status=status.HTTP_404_NOT_FOUND)
  except Exception as err:
    return Response({'error': str(err)}, status=status.HTTP_400_BAD_REQUEST)


# function-based view to remove items from cart
@api_view(['DELETE'])
@permission_classes([IsAuthenticated])
def remove_from_cart(request, plant_id):
  try:
    customer = request.user.customer
    plant = Plant.objects.get(pk=plant_id)
    order = Order.objects.get(customer=customer, complete=False)
    order_item = OrderItem.objects.get(order=order, plant=plant)
    order_item.delete()
    return Response(status=status.HTTP_204_NO_CONTENT)
  except (Plant.DoesNotExist, Order.DoesNotExist, OrderItem.DoesNotExist):
    return Response({'error': 'Item not found in cart.'}, status=status.HTTP_404_NOT_FOUND)
  except Exception as err:
    return Response({'error': str(err)}, status=status.HTTP_400_BAD_REQUEST)


# function-based view to update items (quantity) in cart
@api_view(['PUT'])
@permission_classes([IsAuthenticated])
def update_cart_item(request, plant_id):
  try:
    customer = request.user.customer
    plant = Plant.objects.get(pk=plant_id)
    order = Order.objects.get(customer=customer, complete=False)
    order_item = OrderItem.objects.get(order=order, plant=plant)
    quantity = request.data.get('quantity')

    if quantity is not None and isinstance(quantity, int):
      if quantity > 0:
        order_item.quantity = quantity
        order_item.save()
        return Response(status=status.HTTP_200_OK)
      elif quantity == 0:
        order_item.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)
      else:
        return Response({'error': 'Quantity must be non-negative.'}, status=status.HTTP_400_BAD_REQUEST)
    else:
      return Response({'error': 'Invalid quantity.'}, status=status.HTTP_400_BAD_REQUEST)
  except (Plant.DoesNotExist, Order.DoesNotExist, OrderItem.DoesNotExist):
    return Response({'error': 'Item not found in cart.'}, status=status.HTTP_404_NOT_FOUND)
  except Exception as err:
    return Response({'error': str(err)}, status=status.HTTP_400_BAD_REQUEST)


# function-based view to complete order
@api_view(['POST'])
@permission_classes([IsAuthenticated])
def complete_order(request):
  try:
    customer = request.user.customer
    order = Order.objects.get(customer=customer, complete=False)

    if order.orderitem_set.exists():
      with transaction.atomic(): # this is implemented to solve concurrency issues
        for item in order.orderitem_set.all():
          plant = Plant.objects.select_for_update().get(pk=item.plant.pk) # row-level locking
          plant.stock -= item.quantity

          if plant.stock <= 0:
            plant.stock = 0
            plant.is_available = False

          plant.save()

        order.complete = True
        order.save()
      return Response(status=status.HTTP_200_OK)
    else:
      return Response({'error': 'Order has no items.'}, status=status.HTTP_400_BAD_REQUEST)
  except Order.DoesNotExist:
    return Response({'error': 'Active order not found.'}, status=status.HTTP_404_NOT_FOUND)
  except Exception as err:
    return Response({'error': str(err)}, status=status.HTTP_400_BAD_REQUEST)