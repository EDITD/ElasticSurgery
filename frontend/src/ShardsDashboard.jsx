import React from "react";
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import Typography from '@material-ui/core/Typography';
import CircularProgress from '@material-ui/core/CircularProgress';
import { loadShardStatus } from './data/shards/actions';

const mapStateToProps = ({ shards }) => ({
	...shards,
});

const mapDispatchToProps = {
	loadShardStatus,
}

class ShardsDashboard extends React.Component {
	static propTypes = {
		loadingState: PropTypes.oneOf(['NOT_LOADED', 'LOADING', 'LOADED', 'ERROR']).isRequired,
		data: PropTypes.object,
		error: PropTypes.object,
		loadShardStatus: PropTypes.func.isRequired,
	};

	componentDidMount() {
		const { loadingState } = this.props;
		if (loadingState === 'NOT_LOADED' || loadingState === 'ERROR') {
			this.props.loadShardStatus();
		}
	}

	getContainerStyles() {
		return {
			display: 'flex',
			margin: '0 auto',
			width: '100%',
			alignItems: 'flex-start',
			justifyContent: 'center',
		};
	}

    render() {
		const { loadingState } = this.props;

		if (loadingState === 'NOT_LOADED' || loadingState === 'LOADING') {
			return <div style={this.getContainerStyles()}>
				<CircularProgress />
			</div>;
		}

		if (loadingState === 'ERROR') {
			return <div style={this.getContainerStyles()}>
				<Typography variant="body1" component="p">
					An error occurred loading the current status
				</Typography>
			</div>;
		}

        return <div style={this.getContainerStyles()}>
			<pre><code>{JSON.stringify(this.props.data, null, 2)}</code></pre>
		</div>;
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(ShardsDashboard);
