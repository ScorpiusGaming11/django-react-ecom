from django.contrib import admin
from django.urls import path
from plantshop import views
from rest_framework_simplejwt.views import TokenRefreshView

urlpatterns = [
    path('admin/', admin.site.urls),
    path('register/', views.register_customer, name='register'),
    path('login/', views.MyTokenObtainPairView.as_view(), name='login'),
    path('login/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('logout/', views.logout_customer, name='logout'),
    path('shop/', views.plant_list, name='plant_list'),
    path('shop/<int:pk>/', views.plant_details, name='plant_details'),
    path('shop/categories/', views.category_list, name='category_list'),
    path('shop/orders/', views.order_list, name='order_list'),
    path('shop/cart/', views.view_cart, name='view_cart'),
    path('shop/cart/add/<int:plant_id>/', views.add_to_cart, name='add_to_cart'),
    path('shop/cart/remove/<int:plant_id>/', views.remove_from_cart, name='remove_from_cart'),
    path('shop/cart/update/<int:plant_id>/', views.update_cart_item, name='update_cart_item'),
]
