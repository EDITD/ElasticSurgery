import React from "react";
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import Typography from '@material-ui/core/Typography';
import CircularProgress from '@material-ui/core/CircularProgress';

import { loadTasks } from './data/tasks/actions';
import { loadNodes } from './data/nodes/actions';
import { isErrored, isLoaded, isLoading, isNotLoaded } from './data/utils';
import Table from './Table';

const mapStateToProps = ({ tasks, nodes, clusters }) => ({
    tasks,
    nodes,
    clusters,
});

const mapDispatchToProps = {
    loadTasks,
    loadNodes,
}

class TasksDashboard extends React.Component {
    static propTypes = {
        tasks: PropTypes.shape({
            loadingState: PropTypes.oneOf(['NOT_LOADED', 'LOADING', 'LOADED', 'ERROR']).isRequired,
            data: PropTypes.object,
            error: PropTypes.object,
        }).isRequired,
        nodes: PropTypes.shape({
            loadingState: PropTypes.oneOf(['NOT_LOADED', 'LOADING', 'LOADED', 'ERROR']).isRequired,
            data: PropTypes.object,
            error: PropTypes.object,
        }).isRequired,
        clusters: PropTypes.shape({
            loadingState: PropTypes.oneOf(['NOT_LOADED', 'LOADING', 'LOADED', 'ERROR']).isRequired,
            currentCluster: PropTypes.string,
        }).isRequired,
        loadNodes: PropTypes.func.isRequired,
        loadTasks: PropTypes.func.isRequired,
    };

    componentDidMount() {
        const { tasks, clusters, nodes } = this.props;
        if (!isLoaded(clusters)) {
            return;
        }

        if (isNotLoaded(tasks) || isErrored(tasks)) {
            this.props.loadTasks();
        }

        if (isNotLoaded(nodes) || isErrored(nodes)) {
            this.props.loadNodes();
        }
    }

    componentDidUpdate(prevProps) {
        if (prevProps.clusters.currentCluster !== this.props.clusters.currentCluster) {
            this.props.loadNodes();
            this.props.loadTasks();
        }
    }

    getContainerStyles(dataLoaded) {
        return {
            display: 'flex',
            margin: '0 auto',
            height: '100vh',
            alignItems: 'flex-start',
            justifyContent: dataLoaded ? 'flex-start' : 'center',
        };
    }

    render() {
        const { tasks, nodes } = this.props;
        if (isNotLoaded(tasks) || isLoading(tasks) || isNotLoaded(nodes) || isLoading(nodes)) {
            return <div style={this.getContainerStyles()}>
                <CircularProgress />
            </div>;
        }

        if (isErrored(tasks) || isErrored(nodes)) {
            return <div style={this.getContainerStyles()}>
                <Typography variant="body1" component="p">
                    An error occurred loading the current status
                </Typography>
            </div>;
        }

        const tableConfig = [
            {
                title: 'ID',
                dataKey: 'id',
                width: 100,
                sortable: true,
            },
            {
                title: 'Type',
                dataKey: 'type',
                width: 200,
                sortable: true,
            },
            {
                title: 'Action',
                dataKey: 'action',
                width: 500,
                sortable: true,
            },
            {
                title: 'Node',
                dataKey: 'node',
                width: 300,
                sortable: true,
                formatter: nodeId => {
                    const nodeData = nodes.data.nodes[nodeId];
                    return nodeData ? nodeData.name : nodeId;
                },
            },
            {
                title: 'Running Time',
                dataKey: 'running_time_in_nanos',
                width: 200,
                sortable: true,
            },
            {
                title: 'Child Tasks',
                dataKey: 'children',
                sortable: true,
                formatter: children => children ? children.length : 0,
            },
        ];

        const tasksData = this.props.tasks.data;
        const taskIndices = Object.keys(tasksData.tasks);

        console.log(tasksData, taskIndices);

        const tableData = taskIndices.map(index => ({
            index,
            ...tasksData.tasks[index]
        }));

        return <div style={this.getContainerStyles(true)}>
            <Table config={tableConfig} data={tableData} />
        </div>;
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(TasksDashboard);
