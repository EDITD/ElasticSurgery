from functools import wraps

from elasticsearch import Elasticsearch
from pydash import memoize

from elasticsurgery.settings import ES_STATE_HOSTS


@memoize
def get_es_client(es_hosts):
    return Elasticsearch(es_hosts)


def get_state_es_client():
    return get_es_client(ES_STATE_HOSTS)


def get_cluster_config(cluster_name):
    es_client = get_state_es_client()
    cluster_config_doc = es_client.get(
        index=ES_STATE_HOSTS,
        id=cluster_name,
        doc_type='cluster',
    )
    return cluster_config_doc['_source']


def get_cluster_client(cluster_slug):
    cluster_config = get_cluster_config(cluster_slug)
    return get_es_client(cluster_config['base_url'])


def pass_cluster_client(func):
    '''
    View decorator for views that take `cluster_slug` as the first argument
    and replaces with `cluster_client`.
    '''

    @wraps(func)
    def decorator(cluster_slug, *args, **kwargs):
        cluster_client = get_cluster_client(cluster_slug)
        return func(cluster_client, *args, **kwargs)
    return decorator
