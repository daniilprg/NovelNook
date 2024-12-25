import json
from django.http import JsonResponse
from django.views.decorators.http import require_POST, require_GET
from .models import Favorites
from users.views import json_login_required
from books.models import Books

@json_login_required
@require_POST
def add_to_favorites(request):
    try:
        data = json.loads(request.body)
        book_id = data.get('book_id')
        book = Books.objects.get(pk=book_id)
        Favorites.objects.create(user_id=request.user, book_id=book)
        return JsonResponse({'detail': 'Книга добавлена в избранное'})
    except Books.DoesNotExist:
        return JsonResponse({'error': 'Книга не найдена'}, status=404)
    except Exception as e:
        return JsonResponse({'error': str(e)}, status=500)


@json_login_required
@require_GET
def get_favorites(request):
    favorites = Favorites.objects.filter(user_id=request.user).select_related('book_id')
    favorites_data = [{
        'id': fav.id,
        'book_id': fav.book_id.id,
        'book_title': fav.book_id.title,
        'book_description': fav.book_id.description,
        'book_author': fav.book_id.author,
        'book_genre': fav.book_id.genre,
        'book_cover': fav.book_id.cover.url,
    } for fav in favorites]
    return JsonResponse(favorites_data, safe=False)


@json_login_required
@require_POST
def remove_from_favorites(request):
    try:
        data = json.loads(request.body)
        book_id = data.get('book_id')
        book = Books.objects.get(pk=book_id)
        Favorites.objects.get(user_id=request.user, book_id=book).delete()
        return JsonResponse({'detail': 'Книга удалена из избранного'})
    except Books.DoesNotExist:
        return JsonResponse({'error': 'Книга не найдена'}, status=404)
    except Favorites.DoesNotExist:
        return JsonResponse({'error': 'Книга не найдена в избранном'}, status=404)
    except Exception as e:
        return JsonResponse({'error': str(e)}, status=500)
