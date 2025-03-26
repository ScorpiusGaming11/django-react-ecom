from django.db import models
from django.contrib.auth.models import User


# Category model to group plants by categories
class Category(models.Model):
  name = models.CharField(max_length=200, unique=True, null=False)
  slug = models.SlugField(unique=True, null=True, blank=True)

  def __str__(self):
    return self.name


# Plant model for the main plant products
class Plant(models.Model):
  name = models.CharField(max_length=200, null=False)
  description = models.TextField(null=False)
  price = models.DecimalField(max_digits=10, decimal_places=2, null=False)
  category = models.ForeignKey(Category, on_delete=models.CASCADE, null=False)
  stock = models.IntegerField(default=0, null=False)
  is_available = models.BooleanField(default=True, null=False)
  slug = models.SlugField(unique=True, blank=True, null=True)

  def __str__(self):
    return self.name


# Image model to store images for each plant
class Image(models.Model):
  plant = models.ForeignKey(Plant, on_delete=models.CASCADE, related_name='images')
  image = models.ImageField(upload_to='media/plants/')
  alt_text = models.CharField(max_length=200, blank=True, null=True)

  def __str__(self):
    return f"Image for {self.plant.name}"


# Customer model to store info related to each customer
class Customer(models.Model):
  user = models.OneToOneField(User, on_delete=models.CASCADE)
  phone_number = models.CharField(max_length=20, blank=True, null=True)
  date_of_birth = models.DateField(blank=True, null=True)
  gender = models.CharField(max_length=10, blank=True, null=True)
  newsletter_subscription = models.BooleanField(default=True, null=False)

  def __str__(self):
    return self.user.username


# Order model to keep track of customer's order(s)
class Order(models.Model):
  customer = models.ForeignKey(Customer, on_delete=models.CASCADE, null=False)
  date_ordered = models.DateTimeField(auto_now_add=True, null=False)
  complete = models.BooleanField(default=False, null=False)
  transaction_id = models.CharField(max_length=200, null=True)

  def __str__(self):
    return str(self.id)


  @property
  def get_cart_total(self):
    orderitems = self.orderitems_set.all()
    total = sum([item.get_total for item in orderitems])
    return total


  @property
  def get_cart_items(self):
    orderitems = self.orderitems_set.all()
    total = sum([item.quantity for item in orderitems])
    return total


# OrderItem model to reference each item in the customer's order(s)
class OrderItem(models.Model):
  plant = models.ForeignKey(Plant, on_delete=models.CASCADE, null=False)
  order = models.ForeignKey(Order, on_delete=models.CASCADE, null=False)
  quantity = models.IntegerField(default=0, null=False)
  date_added = models.DateTimeField(auto_now_add=True, null=False)

  def __str__(self):
    return f"{self.quantity} x {self.plant.name} (Order #{self.order.id})"


  @property
  def get_total(self):
    total = self.plant.price * self.quantity
    return total


# ShippingAddress model to store customer's shipping/billing address
class ShippingAddress(models.Model):
  customer = models.ForeignKey(Customer, on_delete=models.CASCADE, null=False)
  order = models.ForeignKey(Order, on_delete=models.CASCADE, null=False)
  address = models.CharField(max_length=200, null=False)
  city = models.CharField(max_length=200, null=False)
  state = models.CharField(max_length=200, null=False)
  zipcode = models.CharField(max_length=200, null=False)
  date_added = models.DateTimeField(auto_now_add=True, null=False)


  def __str__(self):
    return self.address


# Extra models to add: Reviews/Ratings, Discounts/Promotions, Payment Integration, Wishlist, Tags