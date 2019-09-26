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


def pass_cluster_client(func):
    '''
    View decorator for views that take `cluster_slug` as the first argument
    and replaces with `cluster_client`.
    '''

    def decorator(cluster_slug, *args, **kwargs):
        cluster_config = get_cluster_config(cluster_slug)
        cluster_client = get_es_client(cluster_config['base_url'])
        return func(cluster_client, *args, **kwargs)
    return decorator
