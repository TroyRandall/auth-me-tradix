const LOAD_WATCHLISTS = 'watchlist/loadWatchlists';
const CREATE_WATCHLISTS = 'watchlist/createWatchlists';
const DELETE_WATCHLISTS = 'watchlist/deleteWatchlists';
const UPDATE_WATCHLISTS = 'watchlist/updateWatchlist';
const ADD_STOCK = 'watchlist/addStock';
const REMOVE_STOCK = 'watchlist/removeStock';
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
export function updateWatchlist(watchlist){
    return {
        type: UPDATE_WATCHLISTS,
        watchlist
    }
}
export function addStock(stock) {
    return {
        type: ADD_STOCK,
        stock
    }
}

export function deleteStock(info) {
    return {
        type: REMOVE_STOCK,
        info
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
export const addWatchlist = (name,userId) => async dispatch => {
    const response = await fetch(`/api/watchlists/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name, user_id: userId }),
      });
      if (response.ok){
        const data = await response.json();
        dispatch(createWatchlists(data));
        return response
      }
    }

export const removeWatchlist = (watchlistId) => async dispatch => {
    try{
        const response = await fetch(`api/watchlists/${watchlistId}`, {
            method: 'DELETE'
        });
        if(response.ok) {
            dispatch(deleteWatchlists(watchlistId));
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

export const editWatchlist = (watchlist) => async dispatch => {
    try{
        const response = await fetch(`/api/watchlists/${watchlist.id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({name: watchlist.name})
        });
        if (response.ok) {
            const data = await response.json();
            dispatch(updateWatchlist(data));
            return response;
        } else {
            const data = await response.json();
            if(data) {
                throw data.error.messsage;
            }
        }
    } catch(err) {
        throw err

    }
}
export const addStockToWatchlist = (info) => async dispatch => {
    const { watchlist_id, stock_symbol } = info;

    try {
        const response = await fetch(`/api/watchlists/${watchlist_id}/stocks`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({stock_symbol})
        });

        if (response.ok) {
            const data = await response.json();
            dispatch(fetchUserWatchlists(data))
            return response;
        } else {
            const data = await response.json();
            if (data) {
                throw data.error.message;
            }
        }
    } catch (err) {
        throw err;
    }
}
export const deleteStockFromWatchlist = (stock) => async dispatch => {
    const { watchlist_id, stockId } = stock;
    try {
        const response = await fetch(`/api/watchlists/stocks/${stockId}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({stockId})
        });

        if (response.ok) {
            const data = response.json();
            dispatch(deleteStock({watchlist_id, stockId }));
            return response;
        } else {
            const data = await response.json();
            if (data) {
                throw data.error.message;
            }
        }
    } catch (err) {
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
            // return { ...state, watchlists: action.payload };
            newState = copyState(state);
            newState.watchlists[action.watchlist.id] = action.watchlist;
            return newState

        case UPDATE_WATCHLISTS:
            newState = copyState(state);
            const watchlist = action.watchlist;
            newState.watchlists[watchlist.id] = watchlist;
            return newState

        case DELETE_WATCHLISTS:
            newState = copyState(state);
            delete newState.watchlists[action.watchlistId];
            return newState;
        case REMOVE_STOCK:
            newState = copyState(state);
            let {watchlistId, stockId} = action.info;
            let stocklists = newState.watchlists[watchlistId].watchlist_stocks.filter(stock => stock.id !== stockId);
            newState.watchlists[watchlistId].watchlist_stocks = stocklists;
            return newState

        default:
                return state
    }
}


export default watchlistReducer;
