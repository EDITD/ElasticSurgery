import React from "react";
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { Button, CircularProgress, IconButton, Grid, TextField, Typography, Modal } from '@material-ui/core';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import AddBoxIcon from '@material-ui/icons/AddBox'
import { loadSettings, putSetting } from './data/settings/actions';
import { isLoaded, isLoading, isNotLoaded, isErrored } from './data/utils';
import Table from './Table.js';

const mapStateToProps = ({ clusters, settings }) => ({ clusters, settings });
const mapDispatchToProps = {
    loadSettings,
    putSetting,
}

class SettingsModalInner extends React.Component {
    static propTypes = {
        type: PropTypes.oneOf(['persistent', 'transient']).isRequired,
        onClose: PropTypes.func.isRequired,
        putSetting: PropTypes.func.isRequired,
    }

    constructor(props) {
        super(props);
        this.state = {
            setting: props.setting || '',
            value: props.value || '',
        };
    }

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
                width: 800,
            }}>
                <Grid container direction="column" justify="flex-start" alignItems="flex-start" spacing={4}>
                    <Grid item>
                        <Typography variant="h6">{this.props.action} {this.props.type} setting</Typography>
                    </Grid>
                    <Grid item style={{width: '100%'}}>
                        <Grid container direction="row" justify="space-between" alignItems="flex-end">
                            <Grid item style={{width: '48%'}}>
                                <TextField
                                    value={this.state.setting}
                                    label="Setting"
                                    onChange={this.createStateUpdate('setting')}
                                    fullWidth={true}
                                />
                            </Grid>
                            <Grid item style={{width: '48%'}}>
                                <TextField
                                    value={this.state.value}
                                    label="Value"
                                    onChange={this.createStateUpdate('value')}
                                    fullWidth={true}
                                />
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
const SettingsModal = connect(null, mapDispatchToProps)(SettingsModalInner);


const SettingsTable = ({ name, settings, settingsType, onEditCell }) => {
    const [modalOpen, setModalOpen] = React.useState(false);
    const [modalData, setModalData] = React.useState({});
    const [modalAction, setModalAction] = React.useState('New');

    const handleOpenModal = (modalData) => {
        if (modalData) {
            setModalData(modalData);
            setModalAction('Update');
        } else {
            setModalAction('New');
        }

        setModalOpen(true);
    };

    const handleModalClose = () => {
        setModalOpen(false);
        setModalData({});
    };

    const renderRowEditButton = (data) => {
        return (
            <div style={{marginLeft: 15}}>
                <FormControlLabel
                    control={
                        <Button
                            variant="contained"
                            color="primary"
                            onClick={() => handleOpenModal(data)}
                        >Edit</Button>
                    }
                />
                <FormControlLabel
                    control={
                        <Button
                            variant="contained"
                            color="secondary"
                        >Delete</Button>
                    }
                />
            </div>
        );
    }

    const tableConfig = [
        {
            title: 'Setting',
            dataKey: 'setting',
            width: 600,
            searchable: true,
            sortable: true,
        },
        {
            title: 'Value',
            dataKey: 'value',
            width: 600,
            searchable: true,
            sortable: true,
        },
        {
            title: 'Actions',
            dataKey: 'value',
            width: 200,
            renderFunction: renderRowEditButton,
        },
    ];

    let settingsModal = null;
    if (modalOpen) {
        settingsModal = <SettingsModal
            type={settingsType}
            onClose={handleModalClose}
            action={modalAction}
            setting={modalData.setting}
            value={modalData.value}
            open={true}
        />;
    }

    return <Grid container direction="column" alignItems="flex-start" justify="flex-start" style={{height: '100%'}}>
        <Grid container direction="row" alignItems="center" justify="space-between">
            <Grid item>
                <Typography variant="h5">{name}</Typography>
            </Grid>
            <Grid item>
                <IconButton onClick={() => handleOpenModal()}>
                    <AddBoxIcon />
                </IconButton>
                {settingsModal}
            </Grid>
        </Grid>
        <Grid item style={{height: 'calc(100% - 48px)', width: '100%'}}>
            {!!settings.length && <Table config={tableConfig} data={settings} />}
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

    renderAnyPutError() {
        const { settings } = this.props;

        if (settings.puttingState === 'ERROR') {
            return <p>Error writing settings: {settings.error.message}</p>;
        }
    }

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
            {this.renderAnyPutError()}
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
