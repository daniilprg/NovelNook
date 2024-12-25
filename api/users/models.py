from django.db import models, IntegrityError
from django.contrib.auth.models import BaseUserManager, AbstractBaseUser, PermissionsMixin
from django.conf import settings


class UserManager(BaseUserManager):

    def create_user(self, email, password=None):
        """
        Создание обычного пользователя
        :param email password:
        """

        if not email:
            raise ValueError('Пользователь должен иметь почту')

        email = self.normalize_email(email)

        user = self.model(email=email)
        user.set_password(password)

        try:
            user.save(using=self._db)
        except IntegrityError:
            pass

        return user

    def create_superuser(self, email, password=None):
        """
        Создание администратора
        :param email password:
        """

        user = self.create_user(email=email, password=password)
        user.is_admin = True
        user.save(using=self._db)

        return user


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

    @property
    def is_staff(self):
        """ Является ли пользователь администратором? """

        return self.is_admin

    class Meta:
        verbose_name = 'Пользователь'
        verbose_name_plural = 'Пользователи'