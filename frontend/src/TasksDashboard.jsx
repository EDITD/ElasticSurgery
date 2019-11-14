import React from "react";
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import Typography from '@material-ui/core/Typography';
import CircularProgress from '@material-ui/core/CircularProgress';
import Button from '@material-ui/core/Button';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import pretty from 'pretty-time';

import { loadTasks } from './data/tasks/actions';
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


const mapStateToProps = ({ tasks, nodes, clusters }) => ({
    tasks,
    nodes,
    clusters,
});

const mapDispatchToProps = {
    loadTasks,
    loadNodes,
}

const generateTaskTableData = (taskDatas, includeChildren) => {
    return taskDatas.reduce((rows, taskData) => {
        let childRows = [];
        if (includeChildren && taskData.children) {
            childRows = generateTaskTableData(taskData.children.map(child => ({
                ...child,
                id: `${taskData.id}/${child.id}`,
            })));
        }

        return [
            ...rows,
            {
                childrenCount: taskData.children ? taskData.children.length : 0,
                ...taskData,
                id: `${taskData.id}`,
            },
            ...childRows,
        ];
    }, []);
}


class TasksDashboard extends React.Component {
    static propTypes = {
        tasks: dataPropType,
        nodes: dataPropType,
        clusters: PropTypes.shape({
            loadingState: loadingStatePropType,
            currentCluster: PropTypes.string,
        }).isRequired,
        loadNodes: PropTypes.func.isRequired,
        loadTasks: PropTypes.func.isRequired,
    };

    styles = {
        tableWrapper: {
            position: 'absolute',  // only way to get react virtualized to behave sensibly
            top: 124,
            bottom: 0,
            left: 260,
            right: 0,
        },
        controls: {
            height: 20,
            marginLeft: 30,
            marginTop: 20,
        },
    }

    state = {
        showChildren: false,
    }

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
            flexWrap: 'wrap',
            margin: '0 auto',
            alignItems: 'flex-start',
            justifyContent: dataLoaded ? 'flex-start' : 'center',
        };
    }

    refreshTasks = () => {
        this.props.loadTasks();
    }

    toggleShowChildren = () => {
        this.setState({
            showChildren: !this.state.showChildren,
        });
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
                width: 300,
                sortable: true,
                searchable: true,
            },
            {
                title: 'Type',
                dataKey: 'type',
                width: 300,
                sortable: true,
                searchable: true,
            },
            {
                title: 'Action',
                dataKey: 'action',
                width: 500,
                sortable: true,
                searchable: true,
            },
            {
                title: 'Node',
                dataKey: 'node',
                width: 300,
                sortable: true,
                searchable: true,
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
                formatter: nanos => pretty([0, nanos]),
            },
            {
                title: 'Child Tasks',
                dataKey: 'childrenCount',
                sortable: true,
                width: 200,
            },
        ];

        const tableData = generateTaskTableData(
            Object.values(tasks.data.tasks),
            this.state.showChildren,
        );

        return <div style={this.getContainerStyles(true)}>
            <div style={this.styles.controls}>
                <FormControlLabel
                    control={
                        <Button
                            variant="contained"
                            color="primary"
                            onClick={this.refreshTasks}
                        >Refresh</Button>
                    }
                />
                <FormControlLabel
                    control={
                        <Checkbox
                            value={this.state.showChildren}
                            onClick={this.toggleShowChildren}
                        />
                    }
                    label="Show child tasks"
                />
            </div>

            <div style={this.styles.tableWrapper}>
                <Table config={tableConfig} data={tableData} />
            </div>
        </div>;
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(TasksDashboard);
