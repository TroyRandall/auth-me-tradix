
import React, { useState, useCallback, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";

import * as watchlistAction from '../../store/watchlist'


function AddToWatchlist  ({ change })  {
    const symbol = useParams();
    const dispatch = useDispatch();
    const [called, setCalled] = useState(false);
    const [userWatchlist, setUserWatchlist] = useState(false)
    const sessionUser = useSelector(state => state.session.user);
    const watchlist = useSelector((state) => state.watchlists.watchlist)
    const [watchlistId, setWatchlistId] = useState('')


    useEffect(() => {
        const loadData = async() => {
        const watchlists = await dispatch(watchlistAction.fetchUserWatchlists())
        setUserWatchlist(watchlists);

        }
        loadData();

    },[dispatch, sessionUser, called])


    const addToWL = (e) => {
        e.preventDefault()
        setCalled(true);
  }
    const checkCalled = () => {
        if(called){
           return  (Object.values(userWatchlist).map((watchlist) => {
                   return (<div id = 'watchlist-name' onClick={async() => {
                     dispatch(watchlistAction.addStockToWatchlist(watchlist.id, symbol))
                    setCalled(false);
                }} >{watchlist.name}</div>)
            }))
        }
    }

    const changeId = (called ? 'watchlist' : 'watchlist-hidden')

    const handleSubmit = (e) => {
            let response = dispatch(watchlistAction.addStockToWatchlist(watchlistId, symbol))
            setCalled(false);
    }

    return (
        <div>
             <div
        onClick={addToWL}
          className={
            change === "+"
              ? "form-add-to-watchlist"
              : "form-add-to-watchlist-minus"
          }
        >
          Add To watchlist
        </div>
        <div id={changeId} >{called ?   Object.values(userWatchlist.watchlists).map((watchlist) => {
                return (<div id = 'watchlist-name' onClick={handleSubmit} watchlistId = {watchlist.id} >{watchlist.name}</div>)}) : ''}
        </div>
        </div>
)
}

export default AddToWatchlist;
