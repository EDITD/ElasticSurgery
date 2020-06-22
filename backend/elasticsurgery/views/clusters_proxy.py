from flask import jsonify

from elasticsurgery.app import app
from elasticsurgery.utils.elastic import get_cluster_client, pass_cluster_client
from elasticsurgery.utils.log import create_log
from elasticsurgery.utils.request import get_request_data


@app.route('/api/clusters/<cluster_slug>/cat/<data_name>', methods=('GET',))
@pass_cluster_client
def get_cluster_cat_data(cluster_client, data_name):
    method = getattr(cluster_client.cat, data_name)
    return jsonify(method(format='json'))


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
def put_cluster_settings(cluster_slug):
    settings = get_request_data()
    cluster_client = get_cluster_client(cluster_slug)
    new_settings = cluster_client.cluster.put_settings(
        body=settings,
        flat_settings=True,
    )
    create_log('update_cluster_settings', cluster_slug, settings)
    return jsonify(**new_settings)


@app.route('/api/clusters/<cluster_slug>/tasks', methods=('GET',))
@pass_cluster_client
def get_cluster_tasks(cluster_client):
    tasks = cluster_client.tasks.list(group_by='parents', detailed=True)

    def process_task(task):
        if task['action'] == 'indices:data/write/reindex':
            status = task['status']
            percentage_complete = round((
                (status['created'] + status['updated']) / status['total']
                * 100
            ), 2)
            task['status_string'] = (
                f'(created={status["created"]} + updated={status["updated"]})'
                f'/{status["total"]} ({percentage_complete}%)'
            )

        return task

    tasks = {
        task_id: process_task(task)
        for task_id, task in tasks['tasks'].items()
    }
    return jsonify(tasks=tasks)
