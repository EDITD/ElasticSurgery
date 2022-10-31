export const NODE_ACTION_TYPES = {
    LOAD_INDICES: 'LOAD_INDICES',
    LOAD_INDICES_SUCCESS: 'LOAD_INDICES_SUCCESS',
    LOAD_INDICES_ERROR: 'LOAD_INDICES_ERROR',

    LOAD_INDEX_SETTINGS: 'LOAD_INDEX_SETTINGS',
    LOAD_INDEX_SETTINGS_SUCCESS: 'LOAD_INDEX_SETTINGS_SUCCESS',
    LOAD_INDEX_SETTINGS_ERROR: 'LOAD_INDEX_SETTINGS_ERROR',
};

export function loadIndices() {
    return async (dispatch, getState) => {
        const clusterSlug = getState().clusters.currentCluster;
        if (!clusterSlug) {
            return;
        }

        dispatch({
            type: NODE_ACTION_TYPES.LOAD_INDICES,
        });

        try {
            const response = await fetch(`/api/clusters/${clusterSlug}/cat/indices`);
            if (response.ok) {
                const data = await response.json();
                dispatch({
                    type: NODE_ACTION_TYPES.LOAD_INDICES_SUCCESS,
                    data,
                });
            } else {
                throw new Error(`Bad response from server: ${response.statusText}`);
            }
        } catch (error) {
            dispatch({
                type: NODE_ACTION_TYPES.LOAD_INDICES_ERROR,
                error,
            });
        }
    };
}


export function loadIndexSettings(indexName) {
    return async (dispatch, getState) => {
        const clusterSlug = getState().clusters.currentCluster;
        if (!clusterSlug) {
            return;
        }

        dispatch({
            type: NODE_ACTION_TYPES.LOAD_INDEX_SETTINGS,
            indexName,
        });

        try {
            const response = await fetch(`/api/indices/${clusterSlug}/${indexName}`);
            if (response.ok) {
                const data = await response.json();
                dispatch({
                    type: NODE_ACTION_TYPES.LOAD_INDEX_SETTINGS_SUCCESS,
                    indexName,
                    data,
                });
            } else {
                throw new Error(`Bad response from server: ${response.statusText}`);
            }
        } catch (error) {
            dispatch({
                type: NODE_ACTION_TYPES.LOAD_INDEX_SETTINGS_ERROR,
                indexName,
                error,
            });
        }
    };
}