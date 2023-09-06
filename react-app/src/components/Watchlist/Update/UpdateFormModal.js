import { useEffect, useState, useRef } from "react";
import UpdateWatchlistForm from "./Watchlist_UpdateForm";

const UpdateFormModal = ({ watchlist}) => {
    // const [toggle, setToggle] = useState(false);
    // const modalRef = useRef()

    // useEffect(() => {

    //     const closeModal = (e) => {
    //         console.log(modalRef.current)
    //         if(!(modalRef.current.contains(e.target))) {
    //             setToggle(false)
    //             }
    //     }
    //     if(toggle) {
    //         let updateForm = document.getElementById('update-watchlist');
    //     updateForm?.addEventListener('click', closeModal)

    //     return updateForm?.removeEventListener('click', closeModal )
    //     }})
    const [showModal, setShowModal] = useState(false);

    const onClick = (e) => {
      e.stopPropagation();
      setShowModal(true);
    };

    const closeModal = () => {
      setShowModal(false);
    };

    // useEffect(() => {
    //     document.addEventListener('click', e => {
    //         closeDropdown();
    //     });
    // });
    return (
        <>
          {showModal ? (
            <div className="modal">
              <div className="modal-content" onClick={closeModal}>
                <UpdateWatchlistForm watchlist={watchlist} />
              </div>
            </div>
          ) : (
            <button onClick={onClick} className="btn-edit">
              <i className="fa-solid fa-gear"></i>
              <span className="updateform-spanedit">Edit</span>
            </button>
          )}
        </>
      );
    };
        // <> {toggle ? <UpdateWatchlistForm watchlist={watchlist}  id='update-watchlist' ref={modalRef}/> :
        // <button onClick={onClick} className='btn-edit'>
        //     <i className="fa-solid fa-gear"></i>
        //     <span className="updateform-spanedit">Edit</span>
        // </button>}
        // </>

export default UpdateFormModal;
