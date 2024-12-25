from django.db import models

class Books(models.Model):
    """ Модель книг """

    title = models.CharField(
        default='',
        max_length=255,
        blank=False,
        verbose_name='Название книги',
        null=False,
    )

    description = models.TextField(
        default='',
        blank=True,
        verbose_name='Краткое описание',
        null=True,
    )

    author = models.CharField(
        default='',
        max_length=255,
        blank=False,
        verbose_name='Автор',
        null=False,
    )

    genre = models.CharField(
        default='',
        max_length=100,
        blank=False,
        verbose_name='Жанр',
        null=False,
    )

    cover = models.ImageField(
        upload_to='covers/',
        verbose_name='Обложка',
        height_field=None,
        width_field=None,
        max_length=100,
    )

    def __str__(self) -> str:
        return f'{self.title} / {self.author} / {self.genre}'

    class Meta:
        verbose_name = 'Книгу'
        verbose_name_plural = 'Книги'
