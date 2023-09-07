import { useState } from "react";
import { NavLink } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { Modal } from "../../context/Modal";
import * as watchlistAction from '../../store/watchlist';


const Onelist = ({watchlist}) => {
    const sessionUser = useSelector((state) => state.session.user);
    const [showList, setShowList] = useState(false)
    const [show, setShow] = useState(false);
    const [newEditName, setNewEditName] = useState("");
    const [options, setOptions] = useState(false);
    const [mainWatchlist, setMainWatchlist] = useState("");
	const [showDots, setShowDots] = useState(false);
	const caret = showList ? "up" : "down";
	const assets = watchlist.watched_assets;
    const dispatch = useDispatch();
	function showOptions(ev) {
		ev.preventDefault();
		ev.stopPropagation();
        setOptions(!options);
	}

    return (
        <>
        <div className='watchlist-icon'>
                        <img src="https://cdn.robinhood.com/emoji/v0/128/1f4a1.png"/>
                    </div>
        <Modal show={show} onClose={() => setShow(false)}>
				<input
					onChange={(e) => setNewEditName(e.target.value)}
					className="edit-list"
					placeholder={watchlist.name}
					value={newEditName}

				></input>
                <div>
                <button
						onClick={(e) => {
							e.preventDefault();
							dispatch(
							watchlistAction.updateWatchlist(newEditName)
							).then(() => dispatch(watchlistAction.fetchUserWatchlists(sessionUser.id)));
							setShow(false);
							setNewEditName("");
						}}
						className="submit-edit-list"
					>
						Submit
					</button>

                </div>

        </Modal>
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
				{watchlist.name}
				<div id="watchlist-options"  onClick={showOptions}>
					{showDots ? <i class="fas fa-ellipsis-h"></i> : null}
					{options ? (
						<div id="show-watchlist-options">
							<p id="options-list-option" onClick={() => setShow(true)}>
								Edit List
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
								Delete List
							</p>
                            </div>
					) : null}
			</div>
            <i
					className={`fas fa-caret-${caret}`}
					style={{ paddingRight: 8, marginLeft: "40px" }}
				></i>
			</div>


        </>
    )
}
export default Onelist;
