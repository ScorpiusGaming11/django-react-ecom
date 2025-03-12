from django.contrib import admin
from .models import Category, Plant, Image, Customer, Order, OrderItem, ShippingAddress


class CategoryAdmin(admin.ModelAdmin):
  list_display = ('name', 'slug')
  prepopulated_fields = {'slug': ('name',)} # Automatically create the slugs


class PlantAdmin(admin.ModelAdmin):
  list_display = ('name', 'description', 'category', 'price', 'stock', 'is_available', 'slug')
  list_filter = ('category', 'is_available')
  search_field = ('name')
  prepopulated_fields = {'slug': ('name',)}


class ImageAdmin(admin.ModelAdmin):
  list_display = ('plant', 'alt_text')


class CustomerAdmin(admin.ModelAdmin):
  list_display = ('user', 'phone_number', 'date_of_birth', 'gender', 'newsletter_subscription')
  search_fields = ('user__username', 'phone_number')


class OrderAdmin(admin.ModelAdmin):
  list_display = ('id', 'customer', 'date_ordered', 'complete', 'transaction_id')
  list_filter = ('complete', 'date_ordered')


class OrderItemAdmin(admin.ModelAdmin):
  list_display = ('plant', 'order', 'quantity', 'date_added')


class ShippingAddressAdmin(admin.ModelAdmin):
  list_display = ('customer', 'order', 'address', 'city', 'state', 'zipcode', 'date_added')


admin.site.register(Category, CategoryAdmin)
admin.site.register(Plant, PlantAdmin)
admin.site.register(Image, ImageAdmin)
admin.site.register(Customer, CustomerAdmin)
admin.site.register(Order, OrderAdmin)
admin.site.register(OrderItem, OrderItemAdmin)
admin.site.register(ShippingAddress, ShippingAddressAdmin)