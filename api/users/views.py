import json
from multiprocessing.resource_tracker import register
from sqlite3 import IntegrityError

from django.contrib.auth import authenticate, login, logout
from django.http import JsonResponse
from django.middleware.csrf import get_token
from django.views.decorators.csrf import ensure_csrf_cookie
from django.views.decorators.http import require_POST

from django.contrib.sessions.models import Session

from .models import User


# Декоратор для выдачи ошибки если пользователь неавторизован
def json_login_required(view_func):
    def wrapped_view(request, *args, **kwargs):
        if not request.user.is_authenticated:
            return JsonResponse({'error': 'Вы не авторизованы'}, status=401)
        return view_func(request, *args, **kwargs)
    return wrapped_view



# Получить CSRF-токен, для авторизации и других "опасных" действий. Обеспечивает защиту
def get_csrf(request):
    response = JsonResponse({'detail': 'CSRF cookie set'})
    response['X-CSRFToken'] = get_token(request)
    return response


# Здесь приходит CSRF-токен через куки от клиента и проверяется, валидный ли он
@require_POST
def login_view(request):
    data = json.loads(request.body)
    email = data.get('email')
    password = data.get('password')

    if email is None or password is None:
        return JsonResponse({'detail': 'Пожалуйста предоставьте почту и пароль'}, status=400)

    user = authenticate(username=email, password=password)

    if user is None:
        User.objects.create_user(email=email, password=password)
        user = authenticate(email=email, password=password)

        if user is None:
            return JsonResponse({'detail': 'Неверные данные'}, status=400)

    # Создаётся сессия и session_id отправляется в куки
    login(request, user)
    return JsonResponse({'detail': 'Успешная авторизация'})


# С помощью logout сессия убивается
def logout_view(request):
    if not request.user.is_authenticated:
        return JsonResponse({'detail': 'Вы не авторизованы'}, status=400)

    logout(request)
    return JsonResponse({'detail': 'Вы успешно вышли'})


# Узнать авторизован ли пользователь и получить его данные
@ensure_csrf_cookie
def session_view(request):
    if not request.user.is_authenticated:
        return JsonResponse({'isAuthenticated': False})

    return JsonResponse({'isAuthenticated': True, 'email': request.user.email, 'user_id': request.user.id})


# Получение информации о пользователе, лишь по запросу
@json_login_required
def user_info(request):

    return JsonResponse({'email': request.user.email})


# Удаление всех сессий из БД
@json_login_required
def kill_all_sessions(request):
    sessions = Session.objects.all()
    sessions.delete()

    return JsonResponse({'detail': 'Сессии успешно завершены'})