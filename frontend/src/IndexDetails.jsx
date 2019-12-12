import React from "react";
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { Link } from "react-router-dom";
import { Grid, Icon, Typography } from '@material-ui/core';
import {
    Help,
    SentimentVerySatisfiedTwoTone,
    SentimentDissatisfiedTwoTone,
    SentimentVeryDissatisfiedTwoTone,
} from '@material-ui/icons';

const mapStateToProps = ({ indices }, {match}) => ({
    index: indices.data.find(index => (index.index === match.params.indexName)),
});

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
                        <pre>{JSON.stringify(index, null,4)}</pre>
                    </Grid>

                    <Grid item style={this.styles.section}>
                        <Typography variant="h7">Desired Settings</Typography>
                        <pre>{JSON.stringify(index, null,4)}</pre>
                    </Grid>
                </Grid>
            </div>
        );
    }

}

export default connect(mapStateToProps, null)(IndexDetails);
