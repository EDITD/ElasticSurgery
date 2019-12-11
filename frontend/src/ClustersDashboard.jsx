import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import Typography from '@material-ui/core/Typography';
import CircularProgress from '@material-ui/core/CircularProgress';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';

import { addCluster, deleteCluster } from './data/clusters/actions';
import {
    loadingStatePropType,
    isLoading,
    isNotLoaded,
} from './data/utils';


const mapStateToProps = ({ clusters }) => ({
    clusters,
});

const mapDispatchToProps = {
    addCluster,
    deleteCluster,
}

class ClustersDashboard extends React.Component {
    static propTypes = {
        clusters: PropTypes.shape({
            loadingState: loadingStatePropType,
            currentCluster: PropTypes.string,
        }).isRequired,
        addCluster: PropTypes.func.isRequired,
        deleteCluster: PropTypes.func.isRequired,
    }

    state = {
        newClusterName: '',
        newClusterUrl: '',
    }

    addNewCluster = () => {
        this.props.addCluster(this.state.newClusterName, this.state.newClusterUrl);
        this.setState({  // reset
            newClusterName: '',
            newClusterUrl: '',
        });
    }

    render() {
        const { clusters } = this.props;

        if (isNotLoaded(clusters) || isLoading(clusters)) {
            return <CircularProgress />;
        }

        const clustersData = clusters.data.clusters;
        const clusterList = Object.keys(clustersData).map(index => (
            <div key={index}>
                <Typography>
                    {clustersData[index].name}:&nbsp;
                    <code>{clustersData[index].base_url}</code> &nbsp;
                    <Button
                        variant="contained"
                        color="secondary"
                        value={index}
                        onClick={() => this.props.deleteCluster(index)}
                    >Delete</Button>
                </Typography>
            </div>
        ));

        return (
            <div style={{marginLeft: 20, marginTop: 20}}>
                {clusterList}

                <form style={{marginTop: 50}}>
                    <h3>Add Cluster</h3>
                    <TextField
                      label="Cluster Name"
                      margin="normal"
                      value={this.state.newClusterName}
                      onChange={(ev) => this.setState({newClusterName: ev.target.value})}
                    />
                    <TextField
                      label="Cluster URL"
                      margin="normal"
                      style={{marginLeft: 20}}
                      value={this.state.newClusterUrl}
                      onChange={(ev) => this.setState({newClusterUrl: ev.target.value})}
                    />
                    <Button
                        variant="contained"
                        color="primary"
                        style={{marginTop: 30, marginLeft: 20}}
                        onClick={this.addNewCluster}
                    >Add Cluster</Button>
                </form>
            </div>
        );
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(ClustersDashboard);
