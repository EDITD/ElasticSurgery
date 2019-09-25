from flask import Flask

from . import settings

app = Flask('elasticsurgery')
app.debug = settings.DEBUG
app.secret_key = settings.SECRET_KEY
