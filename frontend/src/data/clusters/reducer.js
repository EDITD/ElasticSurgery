import { CLUSTER_ACTION_TYPES } from './actions';

export const initialState = {
    loadingState: 'NOT_LOADED',
};

export function reducer(state, action) {
    if (!state) {
        return {
            ...initialState,
        };
    }

    switch(action.type) {
        case CLUSTER_ACTION_TYPES.LOAD_CLUSTERS:
            return {
                ...state,
                loadingState: 'LOADING',
                error: null,
            };
        case CLUSTER_ACTION_TYPES.LOAD_CLUSTERS_SUCCESS:
            return {
                ...state,
                loadingState: 'LOADED',
                data: action.data,
            };
        case CLUSTER_ACTION_TYPES.LOAD_CLUSTERS_ERROR:
            return {
                ...state,
                loadingState: 'ERROR',
                error: action.error,
            };
        case CLUSTER_ACTION_TYPES.SET_CURRENT_CLUSTER:
            return {
                ...state,
                currentCluster: action.currentCluster,
            };
        case CLUSTER_ACTION_TYPES.ADD_CLUSTER:
            // Add the cluster
            state.data.clusters[action.slug] = action.data;
            return {...state};
        case CLUSTER_ACTION_TYPES.DELETE_CLUSTER:
            // Remove the cluster
            delete state.data.clusters[action.slug];
            return {...state};
        default:
            return state;
    }
}
