import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { FormControl, InputLabel, Select, MenuItem } from '@material-ui/core';
import { loadClusters, setCurrentCluster } from './data/clusters/actions';
import { loadingStatePropType, isErrored, isLoaded, isNotLoaded } from './data/utils';

const mapStateToProps = ({ clusters }) => ({ clusters });
const mapDispatchToProps = {
    loadClusters,
    setCurrentCluster,
};

class ClusterSelector extends React.Component {

    static propTypes = {
        clusters: PropTypes.shape({
            loadingState: loadingStatePropType,
            currentCluster: PropTypes.string,
        }).isRequired,
        loadClusters: PropTypes.func.isRequired,
        setCurrentCluster: PropTypes.func.isRequired,
    };

    componentDidMount() {
        const { clusters } = this.props;
        if (isNotLoaded(clusters) || isErrored(clusters)) {
            this.props.loadClusters();
        }
    }

    setCurrentCluster = e => {
        this.props.setCurrentCluster(e.target.value);
    };

    render() {
        const { clusters } = this.props;
        let clusterOptions = [];
        if (isLoaded(clusters)) {
            clusterOptions = Object.entries(clusters.data.clusters)
                .reduce((options, [slug, clusterDetails]) => {
                    options.push({ slug, name: clusterDetails.name });
                    return options;
                }, []);
        }

        return <FormControl>
            <InputLabel shrink htmlFor='cluster-selection'>Current Cluster</InputLabel>
            <Select
                value={clusters.currentCluster || ''}
                onChange={this.setCurrentCluster}
                inputProps={{
                    name: 'cluster-selection',
                    id: 'cluster-selection',
                }}
                autoWidth
            >
                {clusterOptions.map(({ slug, name }) => <MenuItem value={slug} key={slug}>{name}</MenuItem>)}
            </Select>
        </FormControl>
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(ClusterSelector);
