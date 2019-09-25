#!/usr/bin/env python
from elasticsurgery import views  # noqa F401
from elasticsurgery.app import app

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=80)
