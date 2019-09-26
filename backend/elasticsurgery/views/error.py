from elasticsearch.exceptions import TransportError
from flask import jsonify

from elasticsurgery.app import app


@app.errorhandler(TransportError)
def handle_es_404(e):
    return jsonify(error=e.error, info=e.info), e.status_code
