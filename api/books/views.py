from rest_framework.response import Response
from rest_framework.decorators import api_view
from .serializers import BooksSerializer
from .models import Books

@api_view(['GET'])
def books(request):
    """
    Список книг
    """
    books = Books.objects.all()
    serializer = BooksSerializer(books, many=True)
    return Response(serializer.data)
