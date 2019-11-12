import { SETTING_ACTION_TYPES } from './actions';

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
        case SETTING_ACTION_TYPES.LOAD_SETTINGS:
            return {
                ...state,
                loadingState: 'LOADING',
                error: null,
            };
        case SETTING_ACTION_TYPES.LOAD_SETTINGS_SUCCESS:
            return {
                ...state,
                loadingState: 'LOADED',
                data: action.data,
            };
        case SETTING_ACTION_TYPES.LOAD_SETTINGS_ERROR:
            return {
                ...state,
                loadingState: 'ERROR',
                error: action.error,
            };
        case SETTING_ACTION_TYPES.PUT_SETTING:
            return {
                ...state,
                puttingState: 'LOADING',
                error: null,
            };
        case SETTING_ACTION_TYPES.PUT_SETTING_SUCCESS:
            console.log(state, action);

            return {
                ...state,
                puttingState: 'LOADED',
                data: {
                    ...state.data,
                    [action.settingType]: {
                        ...state.data[action.settingType],
                        ...action.data[action.settingType],
                    },
                },
            };
        case SETTING_ACTION_TYPES.PUT_SETTING_ERROR:
            return {
                ...state,
                puttingState: 'ERROR',
                error: action.error,
            };
        default:
            return state;
    }
}
