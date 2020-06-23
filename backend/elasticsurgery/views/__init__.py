from flask import jsonify, render_template

from ..app import app


@app.route('/ping', methods=('GET',))
def get_ping():
    return jsonify(ping='pong')


@app.route('/', methods=('GET',))
def get_frontend():
    return render_template('index.html')
