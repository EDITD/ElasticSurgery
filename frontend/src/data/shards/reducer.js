import { SHARD_ACTION_TYPES } from './actions';

export const initialState = {
    loadingState: 'NOT_LOADED',
};

export function reducer(state, action) {
    switch (action.type) {
        case SHARD_ACTION_TYPES.LOAD_SHARD_STATUS:
            return {
                ...state,
                loadingState: 'LOADING',
                error: null,
            };
        case SHARD_ACTION_TYPES.LOAD_SHARD_STATUS_SUCCESS:
            return {
                ...state,
                loadingState: 'LOADED',
                data: action.data,
            };
        case SHARD_ACTION_TYPES.LOAD_SHARD_STATUS_ERROR:
            return {
                ...state,
                loadingState: 'ERROR',
                error: action.error,
            };
        default:
            return {
                ...initialState,
            };
    }
}
