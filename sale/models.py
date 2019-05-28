from django.db import models
from phonenumber_field.modelfields import PhoneNumberField


class Restaurant(models.Model):
    name = models.CharField(max_length=50)
    address = models.CharField(max_length=50)
    city = models.CharField(max_length=30)
    state = models.CharField(max_length=50)


class Food(models.Model):
    pass


class Menu(models.Model):
    food = models.ForeignKey(Food, on_delete=models.SET_NULL, blank=True, null=True, )


class Order(models.Model):
    pass


class Customer(models.Model):
    first_name = models.CharField(max_length=30)
    last_name = models.CharField(max_length=30)
    phone_number = PhoneNumberField()
    email_address = models.EmailField()
    address = models.CharField(max_length=50)
    city = models.CharField(max_length=30)
    state = models.CharField(max_length=50)
    order = models.ForeignKey(Order, on_delete=models.CASCADE)


class OrderStatus(models.Model):
    pass
