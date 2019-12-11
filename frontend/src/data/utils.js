import PropTypes from 'prop-types';


export const loadingStatePropType = PropTypes.oneOf([
    'NOT_LOADED', 'LOADING', 'LOADED', 'ERROR',
]).isRequired;


export const dataPropType = PropTypes.shape({
    loadingState: loadingStatePropType,
    data: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
    error: PropTypes.object,
}).isRequired


export function isLoading(store) {
    const { loadingState } = store;
    return loadingState === 'LOADING';
}

export function isNotLoaded(store) {
    const { loadingState } = store;
    return loadingState === 'NOT_LOADED';
}

export function isErrored(store) {
    const { loadingState } = store;
    return loadingState === 'ERROR';
}

export function isLoaded(store) {
    const { loadingState } = store;
    return loadingState === 'LOADED';
}
