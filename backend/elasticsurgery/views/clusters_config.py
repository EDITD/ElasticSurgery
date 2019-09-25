from ..app import app


@app.route('/api/clusters', methods=['POST'])
def create_cluster():
    pass


@app.route('/api/clusters/<cluster_slug>', methods=['DELETE'])
def delete_cluster(cluster_slug):
    pass


@app.route('/api/clusters', methods=['GET'])
def list_clusters():
    pass
