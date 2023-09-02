import { useEffect } from "react";
import UpdateWatchlistForm from "./Watchlist_UpdateForm";

const UpdateFormModal = ({ watchlist, closeDropdown, openModal, closeModal }) => {
    const onClick = (e) => {
        e.stopPropagation();
        openModal(
            <UpdateWatchlistForm watchlist={watchlist} onClose={() => closeModal()} />
        );
        closeDropdown();
    };
    useEffect(() => {
        document.addEventListener('click', e => {
            closeDropdown();
        });
    });

    return (
        <button onClick={onClick} className='btn-edit'>
            <i className="fa-solid fa-gear"></i>
            <span className="updateform-spanedit">Edit</span>
        </button>
    );
}

export default UpdateFormModal;
