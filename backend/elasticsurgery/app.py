from os import path

from flask import Flask

from . import settings


frontend_build_dir = path.abspath(path.join(
    path.dirname(__file__), '..', '..', 'frontend', 'build',
))

app = Flask(
    'elasticsurgery',
    static_folder=path.join(frontend_build_dir, 'static'),
    template_folder=frontend_build_dir,
)
app.debug = settings.DEBUG
app.secret_key = settings.SECRET_KEY
