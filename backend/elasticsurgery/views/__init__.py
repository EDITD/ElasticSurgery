from flask import jsonify

from ..app import app


@app.route('/ping', methods=('GET',))
def get_ping():
    return jsonify(ping='pong')
