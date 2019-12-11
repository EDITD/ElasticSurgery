import React from "react";
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import Typography from '@material-ui/core/Typography';
import CircularProgress from '@material-ui/core/CircularProgress';
import { loadNodes } from './data/nodes/actions';
import { dataPropType, isErrored, isLoading, isNotLoaded } from './data/utils';
import Table from './Table';

const mapStateToProps = ({ nodes }) => ({
    nodes,
});

const mapDispatchToProps = {
    loadNodes,
};

class NodesDashboard extends React.Component {
    static propTypes = {
        nodes: dataPropType,
        loadNodes: PropTypes.func.isRequired,
    };

    componentDidMount() {
        const { nodes } = this.props;
        if (isNotLoaded(nodes) || isErrored(nodes)) {
            this.props.loadNodes();
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
        const { nodes } = this.props;
        if (isNotLoaded(nodes) || isLoading(nodes)) {
            return <div style={this.getContainerStyles()}>
                <CircularProgress />
            </div>;
        }

        if (isErrored(nodes)) {
            return <div style={this.getContainerStyles()}>
                <Typography variant="body1" component="p">
                    An error occurred loading the current status
                </Typography>
            </div>;
        }

        const tableConfig = [
            {
                title: 'Name',
                dataKey: 'name',
                width: 300,
            },
            {
                title: 'Disk',
                dataKey: '',
                width: 100,
            },
            {
                title: 'Type',
                dataKey: 'type',
                width: 100,
            },
            {
                title: 'State',
                dataKey: 'state',
                width: 200,
            },
        ];

        const nodesData = this.props.nodes.data;
        const nodeIndices = Object.keys(nodesData.nodes);

        const tableData = nodeIndices.map(index => ({
            index,
            type: nodesData.nodes[index].attributes.box_type,
            ...nodesData.nodes[index]
        }));

        return <div style={this.getContainerStyles(true)}>
            <Table config={tableConfig} data={tableData} />
        </div>;
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(NodesDashboard);
