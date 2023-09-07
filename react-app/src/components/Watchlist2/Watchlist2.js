import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import * as watchlistAction from '../../store/watchlist';
import Onelist from "./Onelist";
import './Watchlist2.css';


const List = () => {
    const dispatch = useDispatch();
    const sessionUser = useSelector(state => state.session.user);
    const watchlists = useSelector(state => state.watchlists.watchlists);

    const [showNewWatchlist, setShowNewWatchlist] = useState(false);
    const [mainWatchlist, setMainWatchlist] = useState("");
    const [newWatchlist, setNewWatchlist] = useState("");

    useEffect(() => {
        if(sessionUser){
            dispatch(watchlistAction.fetchUserWatchlists())

        }
    },[dispatch, sessionUser, mainWatchlist])

    const submitWatchlist = async(e) => {
        e.preventDefault();
        setShowNewWatchlist(!showNewWatchlist)
        if(!sessionUser) return;
        console.log(watchlists)
        await dispatch(watchlistAction.createWatchlist(newWatchlist, sessionUser.id)).then(() => dispatch(watchlistAction.fetchUserWatchlists(sessionUser.id)))
    }
    if (!watchlists){
        return null
    }
    const handleCancelButton = e => {
        setShowNewWatchlist()
    }
    if (sessionUser && watchlists) {}
    return (

        <div className="watchlist-container">
            <header>
            <div className='watchlist-header'>
                    <div className='watchlist-header-label'>Lists</div>
                    <button className='btn-open btn-add watchlist-btn' onClick={() => setShowNewWatchlist(!showNewWatchlist)}><i className="fa-solid fa-plus"></i></button>
                </div>
            </header>
            <div className='newform-info'>
                    <div className='newform-content-head'>

            <div className="newform-info">

                {showNewWatchlist?(<form onSubmit={submitWatchlist}>
                    <input
                        value={newWatchlist}
                        onChange={(e) => setNewWatchlist(e.target.value)}
                        required
                        placeholder="List Name"
                        className="newfom-info"

                    ></input>
                     <div className='newform-button'>
                    <button type='button' className='btn-cancel-form'onClick={handleCancelButton}>Cancel</button>
                    <button className='btn-submit'type='submit'>Create List</button>
                    </div>
                </form>):null}
                </div>
                </div>

                {Object.keys(watchlists).map((key, index) => (
                    <Onelist watchlist={watchlists[key]}/>
                ))}

            </div>
        </div>


    );
}


export default List;
