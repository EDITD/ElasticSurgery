import { TASK_ACTION_TYPES } from './actions';

export const initialState = {
    loadingState: 'NOT_LOADED',
};

export function reducer(state, action) {
    if (!state) {
        return {
            ...initialState,
        };
    }

    switch (action.type) {
        case TASK_ACTION_TYPES.LOAD_TASK_STATUS:
            return {
                ...state,
                loadingState: 'LOADING',
                error: null,
            };
        case TASK_ACTION_TYPES.LOAD_TASK_STATUS_SUCCESS:
            return {
                ...state,
                loadingState: 'LOADED',
                data: action.data,
            };
        case TASK_ACTION_TYPES.LOAD_TASK_STATUS_ERROR:
            return {
                ...state,
                loadingState: 'ERROR',
                error: action.error,
            };
        default:
            return state;
    }
}
