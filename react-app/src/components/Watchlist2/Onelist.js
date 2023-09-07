import { useState } from "react";
import { NavLink } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import Modal from '../Modal/Modal'
import * as watchlistAction from '../../store/watchlist';
import './OneList.css'



const Onelist = ({watchlist}) => {
    const sessionUser = useSelector((state) => state.session.user);
    const [showList, setShowList] = useState(false)
    const [show, setShow] = useState(false);
    const [newEditName, setNewEditName] = useState("");
    const [options, setOptions] = useState(false);
    const [mainWatchlist, setMainWatchlist] = useState("");
	const [showDots, setShowDots] = useState(false);
	const caret = showList ? "watchlist-opening" : "watchlist-closing";
    const dispatch = useDispatch();
	function showOptions(ev) {
		ev.preventDefault();
		ev.stopPropagation();
        setOptions(!options);
	}
	const submitEditWatchlist = async (e) => {
		e.preventDefault();
		dispatch(
		watchlistAction.updateWatchlist(newEditName)
		).then(() => dispatch(watchlistAction.fetchUserWatchlists(sessionUser.id)));
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
			<button className='btn-openstock watchlist-btn'>
            <i
					className={`fa-solid fa-angle-up ${caret}`}

				></i>
					</button>

			</div>



        </>
    )
}
export default Onelist;
