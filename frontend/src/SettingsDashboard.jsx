import React from "react";
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { Button, CircularProgress, IconButton, Grid, TextField, Typography, Modal } from '@material-ui/core';
import AddBoxIcon from '@material-ui/icons/AddBox'
import { loadSettings, putSetting } from './data/settings/actions';
import { isLoaded, isLoading, isNotLoaded, isErrored } from './data/utils';
import Table from './Table.js';

const mapStateToProps = ({ clusters, settings }) => ({ clusters, settings });
const mapDispatchToProps = {
    loadSettings,
    putSetting,
}

class NewSettingsModalInner extends React.Component {
    static propTypes = {
        type: PropTypes.oneOf(['persistent', 'transient']).isRequired,
        onClose: PropTypes.func.isRequired,
        putSetting: PropTypes.func.isRequired,
        open: PropTypes.bool.isRequired,
    }

    state = {
        setting: '',
        value: '',
    };

    handleSubmit = () => {
        const { setting, value } = this.state;
        this.props.putSetting(this.props.type, setting, value);
        this.props.onClose();
    };

    createStateUpdate = property => e => {
        this.setState({
            [property]: e.target.value,
        });
    }

    render() {
        return <Modal
            open={this.props.open}
            onClose={this.props.onClose}
        >
            <div style={{
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                position: 'absolute',
                backgroundColor: 'white',
                padding: 15,
            }}>
                <Grid container direction="column" justify="flex-start" alignItems="flex-start" spacing={4}>
                    <Grid item>
                        <Typography variant="h6">New {this.props.type} setting</Typography>
                    </Grid>
                    <Grid item>
                        <Grid container direction="row" justify="space-between" alignItems="flex-end">
                            <Grid item>
                                <TextField value={this.state.setting} label="Setting" onChange={this.createStateUpdate('setting')} />
                            </Grid>
                            <Grid item>
                                <TextField value={this.state.value} label="Value" onChange={this.createStateUpdate('value')} />
                            </Grid>
                        </Grid>
                    </Grid>
                    <Grid item>
                        <Button variant="contained" color="primary" onClick={this.handleSubmit}>
                            Submit
                        </Button>
                    </Grid>
                </Grid>
            </div>
        </Modal>
    }
}
const NewSettingsModal = connect(null, mapDispatchToProps)(NewSettingsModalInner);

const SettingsTable = ({ name, settings, settingsType, onEditCell }) => {
    const [modalOpen, setModalOpen] = React.useState(false);

    const handleOpenModal = () => {
        setModalOpen(true);
    };

    const handleModalClose = () => {
        setModalOpen(false);
    };

    const handleCellEdit = (rowData, changedDataKey, newValue, oldValue) => {
        onEditCell({
            rowData,
            changedDataKey,
            newValue,
            oldValue,
        });
    };

    const tableConfig = [
        {
            title: 'Setting',
            dataKey: 'setting',
            width: 600,
            searchable: true,
            sortable: true,
            editable: true,
        },
        {
            title: 'Value',
            dataKey: 'value',
            width: 600,
            searchable: true,
            sortable: true,
            editable: true,
        },
    ];

    return <Grid container direction="column" alignItems="flex-start" justify="flex-start" style={{height: '100%'}}>
        <Grid container direction="row" alignItems="center" justify="space-between">
            <Grid item>
                <Typography variant="h5">{name}</Typography>
            </Grid>
            <Grid item>
                <IconButton onClick={handleOpenModal}>
                    <AddBoxIcon />
                </IconButton>
                <NewSettingsModal type={settingsType} onClose={handleModalClose} open={modalOpen} />
            </Grid>
        </Grid>
        <Grid item style={{height: 'calc(100% - 48px)', width: '100%'}}>
            {!!settings.length && <Table config={tableConfig} data={settings} onCellEdit={handleCellEdit} />}
            {!settings.length && <Typography type="body1">No settings applied</Typography>}
        </Grid>
    </Grid>
}


class SettingsDashboard extends React.Component {
    styles = {
        wrapper: {
            position: 'absolute',  // only way to get react virtualized to behave sensibly
            top: 124,
            bottom: 0,
            left: 260,
            right: 0,
            padding: 20,
        },
    }

    componentDidMount() {
        const { clusters, settings } = this.props;
        if (!isLoaded(clusters)) {
            return;
        }

        if (isNotLoaded(settings) || isErrored(settings)) {
            this.props.loadSettings();
        }
    }

    componentDidUpdate(prevProps) {
        if (prevProps.clusters.currentCluster !== this.props.clusters.currentCluster) {
            this.props.loadSettings();
        }
    }

    getSettings = settingsType => {
        const { settings } = this.props;
        if (!isLoaded(settings)) {
            return [];
        }

        return Object.entries(settings.data[settingsType]).reduce((settingsArray, [setting, value]) => {
            settingsArray.push({ setting, value });
            return settingsArray;
        }, [])
    };

    createCellEdit = settingType => ({
        rowData,
        changedDataKey,
        newValue,
    }) => {
        const setting = changedDataKey === 'setting' ? newValue : rowData.setting;
        const value = changedDataKey === 'value' ? newValue: rowData.value;
        this.props.putSetting(settingType, setting, value);
    };

    render() {
        const { settings } = this.props;

        if (isNotLoaded(settings) || isLoading(settings)) {
            return <Grid container direction="column" alignItems="center" justify="flex-start">
                <Grid item>
                    <CircularProgress />
                </Grid>
            </Grid>;
        }

        if (isErrored(settings)) {
            return <Grid container direction="column" alignItems="center" justify="flex-start">
                <Grid item>
                    <Typography variant="body1" component="p">
                        An error occurred loading the settings
                    </Typography>
                </Grid>
            </Grid>;
        }

        return <div style={this.styles.wrapper}>
            <Grid container direction="column" alignItems="stretch" justify="space-between" spacing={4} style={{height: '100%'}}>
                <Grid item style={{height: '50%'}}>
                    <SettingsTable name="Persistent" settings={this.getSettings('persistent')} settingsType='persistent' onEditCell={this.createCellEdit('persistent')} />
                </Grid>
                <Grid item style={{height: '50%'}}>
                    <SettingsTable name="Transient" settings={this.getSettings('transient')} settingsType='transient' onEditCell={this.createCellEdit('transient')} />
                </Grid>
            </Grid>
        </div>
    }
}



export default connect(mapStateToProps, mapDispatchToProps)(SettingsDashboard);
