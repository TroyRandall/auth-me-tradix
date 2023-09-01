import { useDispatch } from "react-redux"
import * as watchlistAction from '../../../store/watchlist';

const DeleteStockButton = ({ watchlist,stockId }) => {
    const dispatch = useDispatch();
    const handleDeletebtn = () => {
        const watchlistId = watchlist.id;
        dispatch(watchlistAction.deleteStockFromWatchlist({ watchlistId, stockId }));
    }

    return (
        <div className="removestock-container">
            <button className='removestock-btn'onClick={handleDeletebtn}>
            <i className="fa-solid fa-xmark"></i>
            </button>
        </div>
    )
}

export default DeleteStockButton;
