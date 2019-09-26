import React from "react";
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import Typography from '@material-ui/core/Typography';
import CircularProgress from '@material-ui/core/CircularProgress';
import { loadShardStatus } from './data/shards/actions';
import { loadNodes } from './data/nodes/actions';
import { isErrored, isLoading, isNotLoaded } from './data/utils';
import Table from './Table';

const mapStateToProps = ({ shards, nodes }) => ({
    shards,
    nodes,
});

const mapDispatchToProps = {
    loadShardStatus,
    loadNodes,
}

class ShardsDashboard extends React.Component {
    static propTypes = {
        shards: PropTypes.shape({
            loadingState: PropTypes.oneOf(['NOT_LOADED', 'LOADING', 'LOADED', 'ERROR']).isRequired,
            data: PropTypes.object,
            error: PropTypes.object,
        }).isRequired,
        nodes: PropTypes.shape({
            loadingState: PropTypes.oneOf(['NOT_LOADED', 'LOADING', 'LOADED', 'ERROR']).isRequired,
            data: PropTypes.object,
            error: PropTypes.object,
        }).isRequired,
        loadNodes: PropTypes.func.isRequired,
        loadShardStatus: PropTypes.func.isRequired,
    };

    componentDidMount() {
        const { shards, nodes } = this.props;
        if (isNotLoaded(shards) || isErrored(shards)) {
            this.props.loadShardStatus();
        }
        if (isNotLoaded(nodes) || isErrored(nodes)) {
            this.props.loadNodes();
        }
    }

    getContainerStyles(dataLoaded) {
        return {
            display: 'flex',
            margin: '0 auto',
            width: 'calc(100% - 240px)',
            height: '100vh',
            marginLeft: 240,
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
                width: 200,
            },
            {
                title: 'Node',
                dataKey: 'node',
                flexGrow: 1,
                formatter: nodeId => {
                    const nodeData = nodes.data.nodes[nodeId];
                    return nodeData ? nodeData.name : nodeId;
                }
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
            <Table config={tableConfig} data={allShards} />
        </div>;
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(ShardsDashboard);
