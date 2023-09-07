
import React, { useEffect, useState } from "react";
import DeleteWatchlist from "./DeleteForm";
import { useModalContext, Modal } from "../../../context/Modal";

const DeleteModal = ({ watchlist, closeModal }) => {
  const { modelContent, setModalContent } = useModalContext();
  const [showModal, setShowModal] = useState(false);

  const openDeleteModal = () => {
    setModalContent(
      <DeleteWatchlist
        watchlist={watchlist}
        onClose={() => setShowModal(false)}
      />
    );
    setShowModal(true); // Open the modal
  };

  // Close the modal when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (showModal && !e.target.closest(".delete-container")) {
        setShowModal(false);
      }
    };

    document.addEventListener("click", handleClickOutside);

    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, [showModal]);

  return (
    <>
      <button onClick={openDeleteModal} className="btn-deleteform">
        <i className="fa-solid fa-ban"></i>
        <span className="deleteform-spandelete">Delete</span>
      </button>
      {showModal && <Modal>{modelContent}</Modal>}
    </>
  );
};

export default DeleteModal;
