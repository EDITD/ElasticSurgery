export const TASK_ACTION_TYPES = {
    LOAD_TASK_STATUS: 'LOAD_TASK_STATUS',
    LOAD_TASK_STATUS_SUCCESS: 'LOAD_TASK_STATUS_SUCCESS',
    LOAD_TASK_STATUS_ERROR: 'LOAD_TASK_STATUS_ERROR',
};

export function loadTasks() {
    return async (dispatch, getState) => {
        const currentCluster = getState().clusters.currentCluster;
        if (!currentCluster) {
            return;
        }

        dispatch({
            type: TASK_ACTION_TYPES.LOAD_TASK_STATUS,
        });

        try {
            const response = await fetch(`/api/clusters/${currentCluster}/tasks`);
            if (response.ok) {
                const data = await response.json();
                dispatch({
                    type: TASK_ACTION_TYPES.LOAD_TASK_STATUS_SUCCESS,
                    data,
                });
            } else {
                throw new Error(`Bad response from server: ${response.statusText}`);
            }
        } catch (error) {
            dispatch({
                type: TASK_ACTION_TYPES.LOAD_TASK_STATUS_ERROR,
                error,
            });
        }
    };
}
