from flask import jsonify

from elasticsurgery.app import app
from elasticsurgery.settings import ES_LOGS_INDEX_NAME
from elasticsurgery.util.elastic import get_state_es_client


@app.route('/api/logs', methods=('GET',))
def get_logs():
    es_client = get_state_es_client()
    results = es_client.search(
        index=ES_LOGS_INDEX_NAME,
        size=1000,
        body={
            'sort': {
                'datetime_utc': 'desc',
            },
        },
    )
    logs = [log['_source'] for log in results['hits']['hits']]
    return jsonify(
        logs=logs,
        total=results['hits']['total'],
    )
