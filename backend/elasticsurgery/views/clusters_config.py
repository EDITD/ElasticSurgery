from flask import jsonify, request
from slugify import slugify

from elasticsurgery.app import app
from elasticsurgery.settings import ES_CLUSTERS_INDEX_NAME
from elasticsurgery.utils.elastic import get_state_es_client


@app.route('/api/clusters', methods=['POST'])
def create_cluster():
    request_data = request.get_json()

    doc = {
        'name': request_data['name'],
        'base_url': request_data['base_url'],
    }
    slug = slugify(request_data['name'])

    es_client = get_state_es_client()
    es_client.create(
        index=ES_CLUSTERS_INDEX_NAME,
        id=slug,
        body=doc,
    )

    return jsonify(created=True, slug=slug, data=request_data), 201


@app.route('/api/clusters/<cluster_slug>', methods=['DELETE'])
def delete_cluster(cluster_slug):
    es_client = get_state_es_client()
    es_client.delete(
        index=ES_CLUSTERS_INDEX_NAME,
        id=cluster_slug,
    )
    return jsonify(deleted=True, slug=cluster_slug), 200


@app.route('/api/clusters', methods=['GET'])
def list_clusters():
    es_client = get_state_es_client()
    result = es_client.search(
        index=ES_CLUSTERS_INDEX_NAME,
        size=1000,
    )
    clusters = {hit['_id']: hit['_source'] for hit in result['hits']['hits']}
    return jsonify(clusters=clusters), 200
