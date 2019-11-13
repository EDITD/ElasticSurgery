# ElasticSurgery

ElasticSurgery is an Elastcsearch cluster _management interface_. Designed to view and operate cluster level stuff.

## Development

Setup your environment like so - you'll need [`kubetools-client`](https://github.com/EDITD/kubetools-client) installed:

```sh
# Install the node modules
npm install --prefix frontend/

# Start the webserver + development Elasticsearch instance
ktd up
```

And then to start the webpack server and follow the server logs:

```
honcho start
```

### Pointing at another cluster

To look at another cluster in development, first make a copy of `fixtures/dev_cluster_config.json` and add it to the development Elasticsearch instance like so:

```sh
curl -X PUT http://dev.edtd.net:26950/.elasticsurgery-clusters/_doc/<SLUG> \
    -H 'Content-Type: application/json' \
    -d@my_json_config.json
```
