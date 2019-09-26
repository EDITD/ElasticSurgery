export const CLUSTER_ACTION_TYPES = {
    LOAD_CLUSTERS: 'LOAD_CLUSTERS',
    LOAD_CLUSTERS_SUCCESS: 'LOAD_CLUSTERS_SUCCESS',
    LOAD_CLUSTERS_ERROR: 'LOAD_CLUSTERS_ERROR',
    SET_CURRENT_CLUSTER: 'SET_CURRENT_CLUSTER',
};

export function setCurrentCluster(clusterSlug) {
    return {
        type: CLUSTER_ACTION_TYPES.SET_CURRENT_CLUSTER,
        clusterSlug,
    };
}

export function loadClusters() {
    return async (dispatch, getState) => {
        dispatch({
            type: CLUSTER_ACTION_TYPES.LOAD_CLUSTERS,
        });

        try {
            const response = await fetch('/api/clusters');
            if (response.ok) {
                const data = await response.json();
                dispatch({
                    type: CLUSTER_ACTION_TYPES.LOAD_CLUSTERS_SUCCESS,
                    data,
                });
                const currentCluster = getState().clusters.currentCluster;
                if (!currentCluster) {
                    dispatch({
                        type: CLUSTER_ACTION_TYPES.SET_CURRENT_CLUSTER,
                        currentCluster: Object.keys(data.clusters)[0],
                    });
                }
            } else {
                throw new Error(`Bad response from server: ${response.statusText}`);
            }
        } catch (error) {
            dispatch({
                type: CLUSTER_ACTION_TYPES.LOAD_CLUSTERS_ERROR,
                error,
            });
        }
    }
}
