from flask import jsonify

from elasticsurgery.app import app
from elasticsurgery.utils.elastic import pass_cluster_client
from elasticsurgery.utils.log import create_log
from elasticsurgery.utils.request import get_request_data


@app.route('/api/clusters/<cluster_slug>/state/<metric_name>', methods=('GET',))
@pass_cluster_client
def get_cluster_state(cluster_client, metric_name):
    state_data = cluster_client.cluster.state(metric_name)
    return jsonify(**state_data)


@app.route('/api/clusters/<cluster_slug>/settings', methods=('GET',))
@pass_cluster_client
def get_cluster_settings(cluster_client):
    settings_data = cluster_client.cluster.get_settings(flat_settings=True)
    return jsonify(**settings_data)


@app.route('/api/clusters/<cluster_slug>/settings', methods=('PUT',))
@pass_cluster_client
def put_cluster_settings(cluster_client):
    settings = get_request_data()
    new_settings = cluster_client.cluster.put_settings(
        body=settings,
        flat_settings=True,
    )
    create_log('update_cluster_settings', settings)
    return jsonify(**new_settings)


@app.route('/api/clusters/<cluster_slug>/tasks', methods=('GET',))
@pass_cluster_client
def get_cluster_tasks(cluster_client):
    tasks = cluster_client.tasks.list(group_by='parents')
    return jsonify(**tasks)
