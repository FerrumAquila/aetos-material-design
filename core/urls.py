__author__ = 'ironeagle'

from django.conf.urls import url

import views as app_views
import docs as app_docs

urlpatterns = [
    url(r'^home/$', app_views.home, name='core-home'),
] + app_docs.urlpatterns
