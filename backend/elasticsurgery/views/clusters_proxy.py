from ..app import app


@app.route('/api/clusters/<cluster_slug>/state/<metric_name>', methods=['GET'])
def get_cluster_state(cluster_slug, metric_name):
    pass


@app.route('/api/clusters/<cluster_slug>/settings', methods=['GET'])
def get_cluster_settings(cluster_slug):
    pass


@app.route('/api/clusters/<cluster_slug>/settings', methods=['PUT'])
def put_cluster_settings(cluster_slug):
    pass
