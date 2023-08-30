const LOAD_WATCHLISTS = 'watchlist/loadWatchlists';

export function loadWatchlists(watchlists) {
    return {
        type: LOAD_WATCHLISTS,
        watchlists
    }
}


export const fetchUserWatchlists = () => async dispatch => {
    const response = await fetch(`/api/watchlists/current`);
    if(response.ok) {
        const data = await response.json();
        dispatch(loadWatchlists(data.watchlists));
        return response
    }
}


const watchlistReducer = (state = {}, action) => {
    let newState;
    switch(action.type) {
        case LOAD_WATCHLISTS:
            return{
                ...state,
                watchlists: action.watchlists.reduce(
                 (watchlistsById, watchlist) => ({
                    ...watchlistsById, [watchlist.id]:watchlist
                 }), {}
                ),
            }

            default:
                return state
    }
}


export default watchlistReducer;
