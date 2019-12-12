import React from "react";
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { Link } from "react-router-dom";
import { Grid, Typography } from '@material-ui/core';
import {
    Help,
    SentimentVerySatisfiedTwoTone,
    SentimentDissatisfiedTwoTone,
    SentimentVeryDissatisfiedTwoTone,
} from '@material-ui/icons';

import { loadIndexSettings } from "./data/indices/actions";
import {isErrored, isNotLoaded} from "./data/utils";

const mapStateToProps = ({ indices }, {match}) => ({
    index: indices.data.find(index => (index.index === match.params.indexName)),
});

const mapDispatchToProps = {
    loadIndexSettings,
};

class IndexDetails extends React.Component {
    static propTypes = {
        index: PropTypes.object.isRequired,
    };

    styles = {
        page: {
            padding: 20,
        },
        section: {
            marginTop: 20,
        },
        title: {

        }
    };

    componentDidMount() {
        const { index } = this.props;
        if (!index) {
            return;
        }

        const es_settings = index.es_settings;
        if (!es_settings || isNotLoaded(es_settings) || isErrored(es_settings)) {
            this.props.loadIndexSettings(index.index);
        }
    }

    componentDidUpdate(prevProps) {
        const { index } = this.props;
        if (prevProps.index !== index) {
            this.props.loadIndexSettings(index.index);
        }
    }

    renderStatus(status) {
        const statusIcon = {
            green: <SentimentVerySatisfiedTwoTone
                style={{color: "#299C46", verticalAlign: "middle"}}
                fontSize="large"
            />,
            yellow: <SentimentDissatisfiedTwoTone
                style={{color: "#DDAE36", verticalAlign: "middle"}}
                fontSize="large"
            />,
            red: <SentimentVeryDissatisfiedTwoTone
                style={{color: "#D34A3A", verticalAlign: "middle"}}
                fontSize="large" />
        }[status] || <Help style={{color: "#0042FF", verticalAlign: "middle"}} fontSize="large" />;

        return (
            <Typography variant="body1">
                <span>Status:</span>{statusIcon}
            </Typography>
        );
    }

    render() {
        const {index} = this.props;

        if (!index || !index.es_settings || !index.es_settings.data) {
            return null;
        }

        const es_settings = index.es_settings.data[index.index];
        return (
            <div style={this.styles.page}>
                <Grid container direction="column" style={{height: '100%'}}>
                    <Grid item>
                        <Link to="/indices">
                            <Typography variant="subtitle1">Back to list</Typography>
                        </Link>
                        <Typography variant="h5">Index: {index.index}</Typography>
                        {this.renderStatus(index.health)}
                    </Grid>
                    <Grid item style={this.styles.section}>
                        <Typography variant="h7">Current Settings</Typography>
                        <pre>{JSON.stringify(es_settings, null, 4)}</pre>
                    </Grid>

                    <Grid item style={this.styles.section}>
                        <Typography variant="h7">Desired Settings</Typography>
                        <pre>{JSON.stringify(index, null, 4)}</pre>
                    </Grid>
                </Grid>
            </div>
        );
    }

}

export default connect(mapStateToProps, mapDispatchToProps)(IndexDetails);
