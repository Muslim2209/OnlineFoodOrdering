from django.views.generic import TemplateView


class HomeView(TemplateView):
    template_name = 'pages/index.html'


class FoodResultsView(TemplateView):
    template_name = 'pages/food_results.html'


class MapResultsView(TemplateView):
    template_name = 'pages/map_results.html'


class RestaurantsView(TemplateView):
    template_name = 'pages/restaurants.html'


class ProfileView(TemplateView):
    template_name = 'pages/profile.html'


class PricingView(TemplateView):
    template_name = 'pages/pricing.html'


class ContactView(TemplateView):
    template_name = 'pages/contact.html'


class SubmissionView(TemplateView):
    template_name = 'pages/submission.html'


class RegistrationView(TemplateView):
    template_name = 'pages/registration.html'


class CheckoutView(TemplateView):
    template_name = 'pages/checkout.html'
