'''
The code in this file specifies the models to work with
and the fields to be converted to JSON (for frontend use)
'''

from rest_framework import serializers
from django.contrib.auth.models import User
from .models import Category, Plant, Image, Customer, Order, OrderItem, ShippingAddress
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer


class CategorySerializer(serializers.ModelSerializer):
  class Meta:
    model = Category
    fields = '__all__'


class ImageSerializer(serializers.ModelSerializer):
  class Meta:
    model = Image
    fields = '__all__'


class PlantSerializer(serializers.ModelSerializer):
  images = serializers.SerializerMethodField()

  class Meta:
    model = Plant
    fields = '__all__'

  def get_images(self, obj):
    image_urls = []
    for image in obj.images.all():
      full_url = self.context['request'].build_absolute_uri(image.image.url)
      print(f"Full image URL: {full_url}")
      image_urls.append(full_url)
    return image_urls


class UserSerializer(serializers.ModelSerializer):
  password = serializers.CharField(write_only=True)

  class Meta:
    model = User
    fields = ('username', 'password', 'email')


    def create(self, validated_data):
      user = User.objects.create_user(**validated_data)
      return user


class CustomerSerializer(serializers.ModelSerializer):
  user = UserSerializer()

  class Meta:
    model = Customer
    fields = ('user', 'phone_number', 'date_of_birth', 'gender', 'newsletter_subscription')


  def create(self, validated_data):
    user_data = validated_data.pop('user')
    user_serializer = UserSerializer(data=user_data)
    user_serializer.is_valid(raise_exception=True)
    user = user_serializer.save()

    customer = Customer.objects.create(user=user, **validated_data)
    return customer


class MyTokenObtainPairSerializer(TokenObtainPairSerializer):
  @classmethod
  def get_token(cls, user):
    token = super().get_token(user)
    token['username'] = user.username
    return token


class OrderItemSerializer(serializers.ModelSerializer):
  class Meta:
    model = OrderItem
    fields = '__all__'


class OrderSerializer(serializers.ModelSerializer):
  orderitem_set = OrderItemSerializer(many=True, read_only=True)

  class Meta:
    model = Order
    fields = '__all__'


class ShippingAddressSerializer(serializers.ModelSerializer):
  class Meta:
    model = ShippingAddress
    fields = '__all__'