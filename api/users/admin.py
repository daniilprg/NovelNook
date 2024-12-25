from django import forms
from django.contrib import admin
from django.contrib.auth.models import Group
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin
from django.contrib.auth.forms import ReadOnlyPasswordHashField

# Пользовательские модели
from .models import User

class UserCreationForm(forms.ModelForm):
    """ Форма для создания новых пользователей """

    password = forms.CharField(label="Новый пароль", widget=forms.PasswordInput)

    class Meta:
        model = User
        fields = ["email"]

    def save(self, commit=True):
        """ Сохранение нового пользователя """

        user = super().save(commit=False)
        user.set_password(self.cleaned_data["password"])

        if commit:
            user.save()

        return user


class UserChangeForm(forms.ModelForm):
    """ Форма для редактирования пользователей """

    password = ReadOnlyPasswordHashField(label=("Пароль"))

    class Meta:
        model = User
        fields = ["email", "password", "is_admin"]


class UserAdmin(BaseUserAdmin):
    # Формы для добавления и изменения экземпляров пользователей
    form = UserChangeForm
    add_form = UserCreationForm

    # Поля, которые будут использоваться при отображении модели пользователя.
    # Они переопределяют определения в базовом UserAdmin, которые ссылаются на определенные поля в auth.User.
    list_display = ["email"]
    list_filter = ["is_admin"]
    list_editable = []

    fieldsets = [
        ("Учётная запись", {"fields": ["email", "password"]}),
        ("Дополнительно", {"fields": ["is_admin", "last_login"]}),
    ]

    def clean(self):
        cleaned_data = super(UserAdmin, self).clean()
        print(cleaned_data.get('role'))

    # add_fieldsets не является стандартным атрибутом ModelAdmin.
    # UserAdmin переопределяет get_fieldsets для использования этого атрибута при создании пользователя.
    add_fieldsets = [
        (
            None,
            {
                "classes": ["wide"],
                "fields": ["email", "password"],
            },
        ),
    ]

    readonly_fields = ["last_login"]
    search_fields = ["email"]
    ordering = ["email"]
    filter_horizontal = []


# Регистрация нового UserAdmin
admin.site.register(User, UserAdmin)

# Поскольку мы не используем модели Django по умолчанию,
# отменяем регистрацию моделей групп пользователей
admin.site.unregister(Group)