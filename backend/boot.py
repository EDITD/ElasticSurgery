#!/usr/bin/env python

from elasticsurgery.app import app
from elasticsurgery.views import (  # noqa: F401
    clusters_config,
    clusters_proxy,
    error,
    indices_proxy,
    logs,
)


if __name__ == '__main__':
    app.run(host='0.0.0.0', port=80)
