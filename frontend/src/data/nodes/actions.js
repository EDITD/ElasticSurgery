export const NODE_ACTION_TYPES = {
    LOAD_NODES: 'LOAD_NODES',
    LOAD_NODES_SUCCESS: 'LOAD_NODES_SUCCESS',
    LOAD_NODES_ERROR: 'LOAD_NODES_ERROR',
};

export function loadNodes() {
    return async (dispatch, getState) => {
        const clusterSlug = getState().clusters.currentCluster;
        if (!clusterSlug) {
            return;
        }

        dispatch({
            type: NODE_ACTION_TYPES.LOAD_NODES,
        });

        try {
            const response = await fetch(`/api/clusters/${clusterSlug}/state/nodes`);
            if (response.ok) {
                const data = await response.json();
                dispatch({
                    type: NODE_ACTION_TYPES.LOAD_NODES_SUCCESS,
                    data,
                });
            } else {
                throw new Error(`Bad response from server: ${response.statusText}`);
            }
        } catch (error) {
            dispatch({
                type: NODE_ACTION_TYPES.LOAD_NODES_ERROR,
                error,
            });
        }
    };
}
