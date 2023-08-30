const LOAD_WATCHLISTS = 'watchlist/loadWatchlists';
const CREATE_WATCHLISTS = 'watchlist/createWatchlists';
const DELETE_WATCHLISTS = 'watchlist/deleteWatchlists';

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
export function deleteWatchlists(watchlists){
    return {
        type: DELETE_WATCHLISTS,
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
export const createWatchlist = (watchlist) => async dispatch => {
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

export const deleteWatchlist = (watchlistId) => async dispatch => {
    try{
        const response = await fetch(`api/watchlists/${watchlistId}`, {
            method: 'DELETE'
        });
        if(response.ok) {
            dispatch(deleteWatchlist(watchlistId));
            const data = response.json();
            return data;
        } else {
            const data = await response.json();
            if(data){
                throw data
            }
        }
    } catch(err){
        throw err;
    }
}


function copyState(value) {
    if (typeof value === 'object') {
        if (Array.isArray(value)) {
            return value.map(element => copyState(element));
        } else {
            const result = {};
            Object.entries(value).forEach(entry => {
                result[entry[0]] = copyState(entry[1]);
            });
            return result;
        }
    } else {
        return value;
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

        case CREATE_WATCHLISTS:
            newState = copyState(state);
            newState.watchlists[action.watchlist.id] = action.watchlist;
            return newState

        case DELETE_WATCHLISTS:
            newState = copyState(state);
            delete newState.watchlists[action.watchlistId];
            return newState;

        default:
                return state
    }
}


export default watchlistReducer;
