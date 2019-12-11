import React from "react";
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import Typography from '@material-ui/core/Typography';
import CircularProgress from '@material-ui/core/CircularProgress';
import Button from '@material-ui/core/Button';
import FormControlLabel from '@material-ui/core/FormControlLabel';

import { loadIndices } from './data/indices/actions';
import {
    dataPropType,
    loadingStatePropType,
    isErrored,
    isLoaded,
    isLoading,
    isNotLoaded,
} from './data/utils';
import Table from './Table';


const mapStateToProps = ({ indices, clusters }) => ({
    indices,
    clusters,
});

const mapDispatchToProps = {
    loadIndices,
}


class IndicesDashboard extends React.Component {
    static propTypes = {
        clusters: PropTypes.shape({
            loadingState: loadingStatePropType,
            currentCluster: PropTypes.string,
        }).isRequired,
        indices: dataPropType,
        loadIndices: PropTypes.func.isRequired,
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

    componentDidMount() {
        const { indices, clusters } = this.props;
        if (!isLoaded(clusters)) {
            return;
        }

        if (isNotLoaded(indices) || isErrored(indices)) {
            this.props.loadIndices();
        }
    }

    componentDidUpdate(prevProps) {
        if (prevProps.clusters.currentCluster !== this.props.clusters.currentCluster) {
            this.props.loadIndices();
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

    refreshIndices = () => {
        this.props.loadIndices();
    }

    render() {
        const { indices } = this.props;
        if (isNotLoaded(indices) || isLoading(indices)) {
            return <div style={this.getContainerStyles()}>
                <CircularProgress />
            </div>;
        }

        if (isErrored(indices)) {
            return <div style={this.getContainerStyles()}>
                <Typography variant="body1" component="p">
                    An error occurred loading the current status
                </Typography>
            </div>;
        }

        const tableConfig = [
            {
                title: 'Name',
                dataKey: 'index',
                width: 300,
                sortable: true,
                searchable: true,
            },
            {
                title: 'Health',
                dataKey: 'health',
                width: 300,
                sortable: true,
                searchable: true,
            },
            {
                title: 'Status',
                dataKey: 'status',
                sortable: true,
                searchable: true,
                width: 200,
            },
            {
                title: 'Docs',
                dataKey: 'docs_count',
                sortable: true,
                width: 200,
            },
            {
                title: 'Shards',
                dataKey: 'pri',
                sortable: true,
                width: 200,
            },
            {
                title: 'Replicas',
                dataKey: 'rep',
                sortable: true,
                width: 200,
            },
            {
                title: 'Primary Storage',
                dataKey: 'primary_store_size',
                sortable: true,
                width: 200,
            },
            {
                title: 'Total Storage',
                dataKey: 'store_size',
                sortable: true,
                width: 200,
            },
        ];

        const tableData = indices.data.map(index => {
            index.docs_count = parseInt(index['docs.count']);

            index.store_size = index['store.size'];
            index.primary_store_size = index['pri.store.size'];
            return index;
        });

        return <div style={this.getContainerStyles(true)}>
            <div style={this.styles.controls}>
                <FormControlLabel
                    control={
                        <Button
                            variant="contained"
                            color="primary"
                            onClick={this.refreshIndices}
                        >Refresh</Button>
                    }
                />
            </div>

            <div style={this.styles.tableWrapper}>
                <Table config={tableConfig} data={tableData} />
            </div>
        </div>;
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(IndicesDashboard);
