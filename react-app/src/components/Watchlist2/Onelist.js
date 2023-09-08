import { useState } from "react";
import { NavLink, Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import Modal from '../Modal/Modal'
import * as watchlistAction from '../../store/watchlist';
import './OneList.css'
import RemoveStockBtn from "../Watchlist/Delete/DeleteStock";

import SmallChart from "../Watchlist/StockChart";

const Onelist = ({watchlist}) => {
    const sessionUser = useSelector((state) => state.session.user);
    const [showList, setShowList] = useState(false)
    const [show, setShow] = useState(false);
    const [newEditName, setNewEditName] = useState("");
    const [options, setOptions] = useState(false);
    const [mainWatchlist, setMainWatchlist] = useState("");
	const [showDots, setShowDots] = useState(false);
	const caret = showList ? "watchlist-opening" : "watchlist-closing";
	const toggleList = () => {
		// Toggle the showList state when the button is clicked
		setShowList(!showList);
	  };
    const dispatch = useDispatch();
	function showOptions(ev) {
		ev.preventDefault();
		ev.stopPropagation();
        setOptions(!options);
	}
	const submitEditWatchlist = async (e) => {
		e.preventDefault();
		await dispatch(
		watchlistAction.updateWatchlist({name: newEditName, id: watchlist.id})
		);
		setShow(false);
		setNewEditName("");

	};

    return (
        <>

        <Modal show={show} onClose={() => setShow(false)}>

				<input
					onChange={(e) => setNewEditName(e.target.value)}
					className="watchlist-content-1"
					placeholder={watchlist.name}
					value={newEditName}

				></input>
                <div className="button-style-watchlist">

                <button className='btn-openstock-watchlist-btn'
				onClick={submitEditWatchlist}

					>
						Save
					</button>

                </div>

        </Modal>
		<div className="watchlist-content-header">
        <div
				id="single-watchlist-div"
				onClick={() => setShowList(!showList)}
				onMouseEnter={() => setShowDots(true)}
				onMouseLeave={() => {
					if (!options) {
						setShowDots(false);
					}
				}}
			>
				 <div className='watchlist-icon'>
                        <img src="https://cdn.robinhood.com/emoji/v0/128/1f4a1.png"/>
                    </div>
				{watchlist.name}
				<div id="watchlist-options"  onClick={showOptions}>
					{showDots ? <i class="fas fa-ellipsis-h"></i> : null}
					{options ? (
						<div id="show-watchlist-options">

							<p id="options-list-option" onClick={() => setShow(true)}>
							<i className="fa-solid fa-gear"></i>
								Edit
							</p>

							<p
								id="options-list-option"
								onClick={(e) => {
									e.stopPropagation();
									dispatch(watchlistAction.deleteWatchlist(watchlist.id)).then(() =>
										dispatch(watchlistAction.fetchUserWatchlists(sessionUser.id))
									);
									setOptions(false);
								}}
							>
								<i className="fa-solid fa-ban"></i>
								Delete
							</p>
                            </div>
					) : null}
			</div>
			</div>

			<button
        className='btn-openstock watchlist-btn'
        onClick={toggleList}
      >
        <i className={`fa-solid fa-angle-up ${caret}`}></i>
      </button>



			</div>
			{showList &&
                        <div className='watchlist-stocks-container'>
                        {watchlist.watchlist_stocks.length > 0 &&
                            watchlist.watchlist_stocks.map(stock => (
                          <div className='watchlist-minigraph'>
							<div  id='row-intro'>
                            <Link to={`/stocks/${stock.stock_symbol}`}>

                              <SmallChart symbol={stock.stock_symbol} />

                              </Link>
							  </div>
							   <div className="row__chart">
           				 <img id="stockchartpic" style={{width: 60, height: 100}}src="https://robinhood-clone-937dc.web.app/static/media/stock2.b50e9eae.svg"></img>
     					 </div>
                              <RemoveStockBtn symbol={stock.stock_symbol} watchlist={watchlist} stockId={stock.id} />
                              </div>
                                        ))}


						</div>
							}

        </>
    )
}
export default Onelist;
