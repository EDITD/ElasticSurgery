from elasticsurgery.app import app
from elasticsurgery.utils.elastic import pass_cluster_client
from elasticsurgery.utils.request import get_request_data


@app.route('/api/clusters/<cluster_slug>/state/<metric_name>', methods=['GET'])
@pass_cluster_client
def get_cluster_state(cluster_client, metric_name):
    return cluster_client.cluster.state(metric_name)


@app.route('/api/clusters/<cluster_slug>/settings', methods=['GET'])
@pass_cluster_client
def get_cluster_settings(cluster_client):
    return cluster_client.cluster.get_settings()


@app.route('/api/clusters/<cluster_slug>/settings', methods=['PUT'])
@pass_cluster_client
def put_cluster_settings(cluster_client):
    settings = get_request_data()
    return cluster_client.cluster.put_settings(body=settings)
