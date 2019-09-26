from elasticsearch import Elasticsearch
from pydash import memoize

from ..settings import ES_STATE_HOSTS


@memoize
def get_es_client(es_hosts):
    return Elasticsearch(es_hosts)


def get_state_es_client():
    return get_es_client(ES_STATE_HOSTS)


def get_cluster_config(cluster_name):
    es_client = get_state_es_client()
    cluster_config_doc = es_client.get(
        index='.elasticsurgery-clusters',
        id=cluster_name,
        doc_type='cluster',
    )
    return cluster_config_doc['_source']
