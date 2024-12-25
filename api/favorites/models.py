from django.conf import settings
from django.db import models


class Favorites(models.Model):

    user_id = models.ForeignKey(
        to='users.User',
        on_delete=models.CASCADE,
        verbose_name='Пользователь',
        null=False,
        blank=False,
    )

    book_id = models.ForeignKey(
        to='books.Books',
        on_delete=models.CASCADE,
        verbose_name='Книга',
        null=False,
        blank=False,
    )

    def __str__(self) -> str:
        return f'{self.user_id} / {self.book_id}'

    class Meta:
        verbose_name = 'Избранное'
        verbose_name_plural = 'Избранные'