from os import environ


SECRET_KEY = environ.get('SECRET_KEY', 'not-a-secret')

DEBUG = environ.get('DEBUG') == 'on' or environ.get('KTD_ENV')

ES_STATE_HOSTS = environ.get('ES_STATE_HOSTS', 'elasticsurgery-elasticsearch:9200').split(',')

ES_CLUSTERS_INDEX_NAME = environ.get('ES_CLUSTERS_INDEX_NAME', '.elasticsurgery-clusters')
ES_LOGS_INDEX_NAME = environ.get('ES_LOGS_INDEX_NAME', '.elasticsurgery-logs')
