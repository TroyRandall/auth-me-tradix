import { useState } from "react";
import UpdateFormModal from "./UpdateFormModal";
import DeleteModal from "../Delete/DeleteFormModal";

const UpdateButton = ({watchlist, i, openModal, closeModal}) => {
    const [isOpen, setIsOpen] = useState(false);

    // const handleClickBtn = (i) => (e) => {
    //     e.stopPropagation();
    //     const newOpens = {
    //         ...open,
    //         [i]: !open[i]
    //     };
    //     setOpen(newOpens);
    // }
    const handleClickBtn = (e) => {
        e.preventDefault();
        setIsOpen(!isOpen); // Toggle the isOpen state when the button is clicked
      };

      const closeDropdown = () => {
        setIsOpen(false); // Close the modal when this function is called
      };
      return (
        <div className="update-btn-main">
          <button className='btn-update' onClick={handleClickBtn}>
            <i className="fa-solid fa-ellipsis"></i>
          </button>
          {isOpen && (
            <div className="watchlist-dropdown">
              <div className="watchlist-dropdown-update">
                <UpdateFormModal watchlist={watchlist} closeDropdown={closeDropdown} openModal={openModal} closeModal={closeModal} />
              </div>
              <div className="watchlist-dropdown-delete">
              <DeleteModal watchlist={watchlist} closeDropdown={closeDropdown} closeModal={closeModal}  openModal={openModal} />
              </div>
            </div>
          )}
        </div>
      );
    };

//     return (
//         <div className="update-btn-main">
//             <button className='btn-update' onClick={handleClickBtn(i)}>
//                 <i className="fa-solid fa-ellipsis"></i>
//             </button>
//             {open[i] &&
//                 <div className="watchlist-dropdown">
//                     <div className="watchlist-dropdown-update">
//                         <UpdateFormModal watchlist={watchlist} closeDropdown={closeDropdown} openModal={openModal} closeModal={closeModal} />
//                     </div>
//                     <div className="watchlist-dropdown-delete">
//                         <DeleteModal watchlist={watchlist} closeDropdown={closeDropdown} openModal={openModal} closeModal={closeModal} />
//                     </div>
//                 </div>
//             }
//     </div>
//     )
// }
//


export default UpdateButton;
