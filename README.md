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
