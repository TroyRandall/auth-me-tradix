import { useEffect, useState } from "react";
import DeleteWatchlist from "./DeleteForm";
import { Modal } from "../../Modal/Modal";
const DeleteModal = ({ watchlist, closeDropdown, openModal, closeModal }) => {
    // const [showModal, setShowModal] = useState(false);
    const onClick = (e) => {
        e.stopPropagation();
        openModal(
            <DeleteWatchlist watchlist={watchlist} onClose={() => closeModal()} />
        );
        closeDropdown();
    };
    useEffect(() => {
        document.addEventListener('click', e => {
            closeDropdown();
        });
    });

    return (
        <button onClick={onClick} className='btn-deleteform'>
            <i className="fa-solid fa-ban"></i>
            <span className="deleteform-spandelete">Delete</span>
        </button>
    );
    // return (
    //     <>
    //     <button onClick={() => setShowModal(true)} className='btn-deleteform'>
    //     <i className="fa-solid fa-ban"></i>
    //             <span className="deleteform-spandelete">Delete</span>
    //          </button>
    //         {showModal && (
    //             <Modal>
    //                 <DeleteWatchlist watchlist={watchlist } onClose={() => setShowModal(false)}/>
    //             </Modal>
    //       )}

    //     </>

    // )
}

export default DeleteModal;
