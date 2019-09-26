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
