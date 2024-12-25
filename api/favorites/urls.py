from django.urls import path
from . import views

urlpatterns = [
    path('favorites/add/', views.add_to_favorites, name='add_to_favorites'),
    path('favorites/get/', views.get_favorites, name='get_favorites'),
    path('favorites/remove/', views.remove_from_favorites, name='remove_from_favorites'),
]
