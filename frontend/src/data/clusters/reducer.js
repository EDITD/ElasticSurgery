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
                currentCluster: action.clusterSlug,
            };
        default:
            return state;
    }
}
