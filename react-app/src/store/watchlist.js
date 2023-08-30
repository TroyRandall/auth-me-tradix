const LOAD_WATCHLISTS = 'watchlist/loadWatchlists';
const CREATE_WATCHLISTS = 'watchlist/createWatchlists';

export function loadWatchlists(watchlists) {
    return {
        type: LOAD_WATCHLISTS,
        watchlists
    }
}
export function createWatchlists(watchlists){
    return {
        type: CREATE_WATCHLISTS,
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
export const createWatchlist = () => async dispatch => {
    try {
        const response = await fetch(`api/watchlists/`,{
            method:'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({name: watchlist })
        });
        if (response.ok) {
            const data = await response.json();
            dispatch(createWatchlist(data));
            return response;
        } else {
            const data = await response.json();
            if(data) {
                throw data.error.name;
            } else {
                const data = await response.json();
                if(data){
                    throw data.error.name;
                } else {
                    throw ['Error! try again later']
                }
            }
        }

        } catch(err){
            throw err
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
