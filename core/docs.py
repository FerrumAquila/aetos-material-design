__author__ = 'ironeagle'

import os

from django.views.generic.base import TemplateView
from django.conf.urls import url

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
DOCS_HTML_PATH = os.path.join(BASE_DIR, "core/templates/core/docs/")

file_names = []
for (os_dir_path, os_dir_names, os_file_names) in os.walk(DOCS_HTML_PATH):
    file_names.extend(os_file_names)
    break

urlpatterns = [
    url(r'^docs/$', TemplateView.as_view(template_name='core/docs/index.html'), name="core-docs-home"),
] + [
    url(r'^docs/%s$' % file_name, TemplateView.as_view(template_name='core/docs/%s' % file_name),
        name="core-docs-%s" % file_name.split('.')[0])
    for file_name in file_names
]