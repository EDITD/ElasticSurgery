from flask import jsonify

from elasticsurgery.app import app
from elasticsurgery.utils.elastic import pass_cluster_client
from elasticsurgery.utils.request import get_request_data


@app.route('/api/indices/<cluster_slug>/<index_name>', methods=('GET',))
@pass_cluster_client
def get_index(cluster_client, index_name):
    index_data = cluster_client.indices.get(index_name)
    return jsonify(**index_data)


@app.route('/api/indices/<cluster_slug>/<index_name>', methods=('PUT',))
@pass_cluster_client
def put_index(cluster_client, index_name):
    index_data = get_request_data()
    new_index_data = cluster_client.indices.create(index_name, body=index_data)
    return jsonify(updated=True, **new_index_data)
