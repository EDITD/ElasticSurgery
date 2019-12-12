import React from "react";
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import Typography from '@material-ui/core/Typography';
import CircularProgress from '@material-ui/core/CircularProgress';

import { loadShardStatus } from './data/shards/actions';
import { loadNodes } from './data/nodes/actions';
import {
    dataPropType,
    loadingStatePropType,
    isErrored,
    isLoaded,
    isLoading,
    isNotLoaded,
} from './data/utils';
import Table from './Table';

const mapStateToProps = ({ shards, nodes, clusters }) => ({
    shards,
    nodes,
    clusters,
});

const mapDispatchToProps = {
    loadShardStatus,
    loadNodes,
};

class ShardsDashboard extends React.Component {
    static propTypes = {
        shards: dataPropType,
        nodes: dataPropType,
        clusters: PropTypes.shape({
            loadingState: loadingStatePropType,
            currentCluster: PropTypes.string,
        }).isRequired,
        loadNodes: PropTypes.func.isRequired,
        loadShardStatus: PropTypes.func.isRequired,
    };

    styles = {
        tableWrapper: {
            position: 'absolute',
            top: 64,
            bottom: 0,
            left: 260,
            right: 0,
        },
    }

    componentDidMount() {
        const { shards, nodes, clusters } = this.props;
        if (!isLoaded(clusters)) {
            return;
        }

        if (isNotLoaded(shards) || isErrored(shards)) {
            this.props.loadShardStatus();
        }
        if (isNotLoaded(nodes) || isErrored(nodes)) {
            this.props.loadNodes();
        }
    }

    componentDidUpdate(prevProps) {
        if (prevProps.clusters.currentCluster !== this.props.clusters.currentCluster) {
            this.props.loadNodes();
            this.props.loadShardStatus();
        }
    }

    getContainerStyles(dataLoaded) {
        return {
            display: 'flex',
            flexWrap: 'wrap',
            margin: '0 auto',
            alignItems: 'flex-start',
            justifyContent: dataLoaded ? 'flex-start' : 'center',
        };
    }

    render() {
        const { shards, nodes } = this.props;
        if (isNotLoaded(shards) || isLoading(shards) || isNotLoaded(nodes) || isLoading(nodes)) {
            return <div style={this.getContainerStyles()}>
                <CircularProgress />
            </div>;
        }

        if (isErrored(shards) || isErrored(nodes)) {
            return <div style={this.getContainerStyles()}>
                <Typography variant="body1" component="p">
                    An error occurred loading the current status
                </Typography>
            </div>;
        }

        const tableConfig = [
            {
                title: 'Index',
                dataKey: 'index',
                width: 300,
                searchable: true,
                sortable: true,
            },
            {
                title: 'Shard #',
                dataKey: 'shard',
                width: 100,
            },
            {
                title: 'Primary',
                dataKey: 'primary',
                width: 100,
                formatter: isPrimary => isPrimary ? '\u2714' : '\u2718',
            },
            {
                title: 'State',
                dataKey: 'state',
                width: 300,
                searchable: true,
                sortable: true,
            },
            {
                title: 'Node',
                dataKey: 'node',
                flexGrow: 1,
                width: 300,
                formatter: nodeId => {
                    const nodeData = nodes.data.nodes[nodeId];
                    return nodeData ? nodeData.name : nodeId;
                },
                searchable: true,
                sortable: true,
            },
        ];

        const routingTable = this.props.shards.data.routing_table;
        const indices = Object.keys(routingTable.indices);
        const allShards = indices.reduce((allIndices, index) => {
            const indexData = routingTable.indices[index];
            const shardNames = Object.keys(indexData.shards);
            const shards = shardNames.reduce((allShards, shard) => {
                const shardData = indexData.shards[shard];
                allShards.push(...shardData);
                return allShards;
            }, []);
            allIndices.push(...shards);
            return allIndices;
        }, []);

        return <div style={this.getContainerStyles(true)}>
            <div style={this.styles.tableWrapper}>
                <Table config={tableConfig} data={allShards} />
            </div>
        </div>;
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(ShardsDashboard);
