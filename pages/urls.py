from django.urls import path
from .views import (
    HomeView,
    FoodResultsView,
    MapResultsView,
    RestaurantsView,
    ProfileView,
    PricingView,
    ContactView,
    SubmissionView,
    RegistrationView,
    CheckoutView
)

urlpatterns = [
    path('', HomeView.as_view(), name='home'),
    path('food_results/', FoodResultsView.as_view(), name='food_results'),
    path('map_results/', MapResultsView.as_view(), name='map_results'),
    path('restaurants/', RestaurantsView.as_view(), name='restaurants'),
    path('profile/', ProfileView.as_view(), name='profile'),
    path('pricing/', PricingView.as_view(), name='pricing'),
    path('contact/', ContactView.as_view(), name='contact'),
    path('submission/', SubmissionView.as_view(), name='submission'),
    path('registration/', RegistrationView.as_view(), name='registration'),
    path('checkout/', CheckoutView.as_view(), name='checkout'),

]
