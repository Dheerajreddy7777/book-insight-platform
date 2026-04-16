from django.urls import path
from . import views

urlpatterns = [
    path('books/', views.get_all_books, name='get_all_books'),
    path('books/<int:pk>/', views.get_book_detail, name='get_book_detail'),
    path('books/add/', views.add_book, name='add_book'),
    path('books/<int:pk>/recommendations/', views.get_recommendations, name='get_recommendations'),
    path('books/ask/', views.ask_question, name='ask_question'),
]