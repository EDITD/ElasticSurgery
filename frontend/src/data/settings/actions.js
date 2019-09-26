export const SETTING_ACTION_TYPES = {
    LOAD_SETTINGS: 'LOAD_SETTINGS',
    LOAD_SETTINGS_SUCCESS: 'LOAD_SETTINGS_SUCCESS',
    LOAD_SETTINGS_ERROR: 'LOAD_SETTINGS_ERROR',
    PUT_SETTING: 'PUT_SETTING',
    PUT_SETTING_SUCCESS: 'PUT_SETTING_SUCCESS',
    PUT_SETTING_ERROR: 'PUT_SETTING_ERROR',
};

export function loadSettings() {
    return async (dispatch, getState) => {
        const clusterSlug = getState().clusters.currentCluster;
        if (!clusterSlug) {
            return;
        }

        dispatch({
            type: SETTING_ACTION_TYPES.LOAD_SETTINGS,
        });

        try {
            const response = await fetch(`/api/clusters/${clusterSlug}/settings`);
            if (response.ok) {
                const data = await response.json();
                dispatch({
                    type: SETTING_ACTION_TYPES.LOAD_SETTINGS_SUCCESS,
                    data,
                });
            } else {
                throw new Error(`Bad response from server: ${response.statusText}`);
            }
        } catch (error) {
            dispatch({
                type: SETTING_ACTION_TYPES.LOAD_SETTINGS_ERROR,
                error,
            });
        }
    }
}

export function putSetting(settingType, setting, value) {
    return async (dispatch, getState) => {
        const clusterSlug = getState().clusters.currentCluster;
        if (!clusterSlug) {
            return;
        }

        dispatch({
            type: SETTING_ACTION_TYPES.PUT_SETTING,
        });

        try {
            const response = await fetch(`api/clusters/${clusterSlug}/settings`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    [settingType]: {
                        [setting]: value,
                    },
                }),
            });
            if (response.ok) {
                const data = await response.json();
                dispatch({
                    type: SETTING_ACTION_TYPES.PUT_SETTING_SUCCESS,
                    data,
                    settingType,
                });
            } else {
                throw new Error(`Bad response from the server ${response.statusText}`);
            }
        } catch (error) {
            dispatch({
                type: SETTING_ACTION_TYPES.PUT_SETTING_ERROR,
                error,
            });
        }
    };
}
