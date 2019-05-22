from django.shortcuts import render


def store_home(request):
    return render(request, 'store.html')
