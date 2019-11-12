from flask import jsonify

from elasticsurgery.app import app
from elasticsurgery.utils.log import search_logs


def _get_and_return_logs(*args, **kwargs):
    results = search_logs(*args, **kwargs)
    logs = [log['_source'] for log in results['hits']['hits']]
    return jsonify(
        logs=logs,
        total=results['hits']['total'],
    )


@app.route('/api/logs', methods=('GET',))
def get_logs():
    return _get_and_return_logs()


@app.route('/api/logs/<log_type>', methods=('GET',))
def get_logs_type(log_type):
    return _get_and_return_logs(log_type)
