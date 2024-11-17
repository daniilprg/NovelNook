from django.db import models
from django.contrib.auth.models import BaseUserManager, AbstractBaseUser, PermissionsMixin
from django.conf import settings


class UserManager(BaseUserManager):

    def create_user(self, email, password=None, **extra_fields):
        """
        Создание обычного пользователя
        :param email password:
        """

        if not email:
            raise ValueError('Пользователь должен иметь почту')

        email = self.normalize_email(email)

        user = self.model(email=email, **extra_fields)
        user.set_password(password)
        user.save(using=self._db)

        return user

    def create_superuser(self, email, password=None, **extra_fields):
        """
        Создание администратора
        :param email password:
        """

        extra_fields.setdefault('is_admin', True)
        extra_fields.setdefault('is_superuser', True)
        extra_fields.setdefault('is_staff', True)

        if extra_fields.get('is_admin') is not True:
            raise ValueError('Суперпользователь должен иметь is_admin=True.')
        if extra_fields.get('is_superuser') is not True:
            raise ValueError('Суперпользователь должен иметь is_superuser=True.')
        if extra_fields.get('is_staff') is not True:
            raise ValueError('Суперпользователь должен иметь is_staff=True.')

        return self.create_user(email, password, **extra_fields)


class User(AbstractBaseUser, PermissionsMixin):

    email = models.EmailField(
        verbose_name='Email',
        max_length=255,
        unique=True,
    )

    is_admin = models.BooleanField(default=False, verbose_name='Администрирование')

    objects = UserManager()

    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = []

    def __str__(self):
        """ Отображение аккаунта """
        return self.email

    def has_perm(self, perm, obj=None):
        """ Есть ли у пользователя определенное разрешение? """
        return True

    def has_module_perms(self, app_label):
        """ Есть ли у пользователя разрешения на просмотр приложения app_label? """
        return True
