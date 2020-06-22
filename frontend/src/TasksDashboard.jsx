import React from "react";
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import Typography from '@material-ui/core/Typography';
import CircularProgress from '@material-ui/core/CircularProgress';
import Button from '@material-ui/core/Button';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import TextField from '@material-ui/core/TextField';
import Checkbox from '@material-ui/core/Checkbox';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
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
};

const filterTaskTableData = (taskDatas, tasksFilter) => {
    if (!tasksFilter) {
        return taskDatas;
    }

    return taskDatas.filter(taskData => {
        if (taskData.action.indexOf(tasksFilter) > 0) {
            return true;
        }
        if (taskData.type.indexOf(tasksFilter) > 0) {
            return true;
        }
        return false;
    });
};

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
};


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
    };

    state = {
        showChildren: false,
        tasksFilter: '',
        refreshInterval: 0,
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

    componentWillUnmount() {
        this.clearAnyRefreshInterval();
    }

    componentDidUpdate(prevProps, prevState) {
        if (prevProps.clusters.currentCluster !== this.props.clusters.currentCluster) {
            this.props.loadNodes();
            this.props.loadTasks();
        }

        if (prevState.refreshInterval !== this.state.refreshInterval) {
            this.clearAnyRefreshInterval();
            if (this.state.refreshInterval) {
                this.refreshIntervalTimer = setInterval(
                    this.props.loadTasks,
                    this.state.refreshInterval * 1000,
                );
            }
        }
    }

    clearAnyRefreshInterval() {
        if (this.refreshIntervalTimer) {
            clearInterval(this.refreshIntervalTimer);
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
    };

    toggleShowChildren = () => {
        this.setState({
            showChildren: !this.state.showChildren,
        });
    };

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
            },
            {
                title: 'Type',
                dataKey: 'type',
                width: 300,
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
            filterTaskTableData(Object.values(tasks.data.tasks), this.state.tasksFilter),
            this.state.showChildren,
        );

        return <div style={this.getContainerStyles(true)}>
            <div style={this.styles.controls}>
                <FormControlLabel
                    style={{marginRight: 40}}
                    control={
                        <Button
                            variant="contained"
                            color="primary"
                            onClick={this.refreshTasks}
                        >Refresh</Button>
                    }
                />
                <FormControlLabel
                    style={{marginRight: 20}}
                    label="Refresh interval"
                    control={
                        <Select
                            value={this.state.refreshInterval}
                            onChange={(ev) => this.setState({refreshInterval: ev.target.value})}
                        >
                            <MenuItem value={0}>Disabled</MenuItem>
                            <MenuItem value={10}>10s</MenuItem>
                            <MenuItem value={30}>30s</MenuItem>
                            <MenuItem value={60}>60s</MenuItem>
                        </Select>
                    }
                />
                <FormControlLabel
                    style={{marginRight: 40}}
                    control={
                        <Checkbox
                            value={this.state.showChildren}
                            onClick={this.toggleShowChildren}
                        />
                    }
                    label="Show child tasks"
                />
                <FormControlLabel
                    control={
                        <TextField
                            value={this.state.tasksFilter}
                            onChange={(ev) => this.setState({tasksFilter: ev.target.value})}
                        />
                    }
                    label="Filter tasks"
                />
            </div>

            <div style={this.styles.tableWrapper}>
                <Table config={tableConfig} data={tableData} />
            </div>
        </div>;
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(TasksDashboard);
