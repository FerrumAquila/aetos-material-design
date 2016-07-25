import views as app_views

from django.conf.urls import url

urlpatterns = [
    url(r'^home/$', app_views.home, name='notice-board-home'),
    url(r'^$', app_views.home, name='notice-board-home'),
]
