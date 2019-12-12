export const SHARD_ACTION_TYPES = {
    LOAD_SHARD_STATUS: 'LOAD_SHARD_STATUS',
    LOAD_SHARD_STATUS_SUCCESS: 'LOAD_SHARD_STATUS_SUCCESS',
    LOAD_SHARD_STATUS_ERROR: 'LOAD_SHARD_STATUS_ERROR',
};

export function loadShardStatus() {
    return async (dispatch, getState) => {
        const currentCluster = getState().clusters.currentCluster;
        if (!currentCluster) {
            return;
        }

        dispatch({
            type: SHARD_ACTION_TYPES.LOAD_SHARD_STATUS,
        });

        try {
            const response = await fetch(`/api/clusters/${currentCluster}/state/routing_table`);
            if (response.ok) {
                const data = await response.json();
                dispatch({
                    type: SHARD_ACTION_TYPES.LOAD_SHARD_STATUS_SUCCESS,
                    data,
                });
            } else {
                throw new Error(`Bad response from server: ${response.statusText}`);
            }
        } catch (error) {
            dispatch({
                type: SHARD_ACTION_TYPES.LOAD_SHARD_STATUS_ERROR,
                error,
            });
        }
    };
}
