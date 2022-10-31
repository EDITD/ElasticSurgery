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
    const newState = {...state};
    let index = null;

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

        case NODE_ACTION_TYPES.LOAD_INDEX_SETTINGS:
            index = state.data.find(index => (index.index === action.indexName));

            if (index) {
                index.es_settings = {
                    loadingState: 'LOADING',
                    error: null,
                };
            }
            return newState;
        case NODE_ACTION_TYPES.LOAD_INDEX_SETTINGS_SUCCESS:
            index = state.data.find(index => (index.index === action.indexName));

            if (index) {
                index.es_settings = {
                    loadingState: 'LOADED',
                    data: action.data,
                };
            }
            return newState;
        case NODE_ACTION_TYPES.LOAD_INDEX_SETTINGS_ERROR:
            index = state.data.find(index => (index.index === action.indexName));

            if (index) {
                index.es_settings = {
                    loadingState: 'ERROR',
                    error: action.error,
                };
            }
            return newState;

        default:
            return state;
    }
}
