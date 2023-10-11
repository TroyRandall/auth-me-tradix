import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import * as watchlistAction from '../../store/watchlist';
import Onelist from "./Onelist";
import './Watchlist2.css';


const List = () => {
    const dispatch = useDispatch();
    const sessionUser = useSelector(state => state.session.user);
    const watchlists = useSelector(state => state.watchlists.watchlists);
    const [validationError, setValidationError] = useState('');
    const [showNewWatchlist, setShowNewWatchlist] = useState(false);
    const [mainWatchlist, setMainWatchlist] = useState("");
    const [newWatchlist, setNewWatchlist] = useState("");

    useEffect(() => {
        if(sessionUser){
            dispatch(watchlistAction.fetchUserWatchlists())

        }
    },[dispatch, sessionUser, mainWatchlist, validationError])
    const submitWatchlist = async (e) => {
    e.preventDefault();
    setValidationError('');
    if (newWatchlist.length > 64) {
    setValidationError('List name must be less than 64 characters');
    return;
    }
        if (newWatchlist.trim().length < 1) {
        setValidationError('List name cannot be blank!!!');
        return;
  }
    await dispatch(watchlistAction.createWatchlist(newWatchlist, sessionUser.id));
    dispatch(watchlistAction.fetchUserWatchlists(sessionUser.id));
  setShowNewWatchlist(!showNewWatchlist);
  setNewWatchlist('')
}
// console.log(validationError, "-----")

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
                     {validationError && <li className='newform-error'>{validationError}</li>}
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
