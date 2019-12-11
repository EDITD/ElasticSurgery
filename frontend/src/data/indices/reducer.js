import { NODE_ACTION_TYPES } from './actions';

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
        case NODE_ACTION_TYPES.LOAD_INDICES:
            return {
                ...state,
                loadingState: 'LOADING',
                error: null,
            };
        case NODE_ACTION_TYPES.LOAD_INDICES_SUCCESS:
            return {
                ...state,
                loadingState: 'LOADED',
                data: action.data,
            };
        case NODE_ACTION_TYPES.LOAD_INDICES_ERROR:
            return {
                ...state,
                loadingState: 'ERROR',
                error: action.error,
            };
        default:
            return state;
    }
}
