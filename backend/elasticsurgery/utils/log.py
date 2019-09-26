from datetime import datetime

from elasticsurgery.settings import ES_LOGS_INDEX_NAME
from elasticsurgery.utils.elastic import get_state_es_client


def create_log(type_, data):
    es_client = get_state_es_client()
    es_client.create(
        index=ES_LOGS_INDEX_NAME,
        body={
            'type': type_,
            'data': data,
            'datetime_utc': datetime.utcnow(),
        },
    )


def search_logs(type_=None, sort_field='datetime_utc', sort_order='desc', size=1000):
    es_client = get_state_es_client()

    query = {'match_all': {}}

    if type_ is not None:
        if not isinstance(type_, (list, tuple)):
            type_ = [type_]

        query = {
            'terms': {
                'type': type_,
            },
        }

    results = es_client.search(
        index=ES_LOGS_INDEX_NAME,
        size=size,
        body={
            'query': query,
            'sort': {
                sort_field: sort_order,
            },
        },
    )

    return results
