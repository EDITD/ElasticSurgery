import React from "react";
import { connect } from 'react-redux';

const mapStateToProps = () => ({});

const mapDispatchToProps = {
}

class ClustersDashboard extends React.Component {

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
        return "Clusters!"
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(ClustersDashboard);
