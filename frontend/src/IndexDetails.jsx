import React from "react";
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

const mapStateToProps = ({ indices }, {match}) => ({
    index: indices.data.find(index => (index.index === match.params.indexName)),
});

class IndexDetails extends React.Component {
    static propTypes = {
        index: PropTypes.object.isRequired,
    };

    render() {
        return (
            <div>
                <h1>"Details"</h1>
                <h2>{this.props.index.index}</h2>
            </div>
        );
    }

}

export default connect(mapStateToProps, null)(IndexDetails);
