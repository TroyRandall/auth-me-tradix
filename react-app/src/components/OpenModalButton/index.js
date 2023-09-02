
import { useModal } from '../../context/Modal';
import React, { useContext, useRef, useState, useEffect } from 'react';
import ReactDOM from 'react-dom';
import './index.css';

const ModalContext = React.createContext();

export function ModalProvider({ children }) {
  const modalRef = useRef();
  const [value, setValue] = useState();

  useEffect(() => {
    setValue(modalRef.current);
  }, []);

  return (
    <>
      <ModalContext.Provider value={value}>
        {children}
      </ModalContext.Provider>
      <div ref={modalRef} />
    </>
  );
}

export function Modal({ onClose, children }) {
  const modalNode = useContext(ModalContext);
  if (!modalNode) return null;

  return ReactDOM.createPortal(
    <div id="modal">
      <div id="modal-background" onClick={onClose} />
      <div id="modal-content">
        {children}
      </div>
    </div>,
    modalNode
  );
}
export default Modal;

export function useModalContext() {
  return useContext(ModalContext);
}

// function OpenModalButton({
//   modalComponent, // component to render inside the modal
//   buttonText, // text of the button that opens the modal
//   onButtonClick, // optional: callback function that will be called once the button that opens the modal is clicked
//   onModalClose // optional: callback function that will be called once the modal is closed
// }) {
//   const { setModalContent, setOnModalClose } = useModal();

//   const onClick = () => {
//     if (onModalClose) setOnModalClose(onModalClose);
//     setModalContent(modalComponent);
//     if (onButtonClick) onButtonClick();
//   };

//   return (
//     <button onClick={onClick}>{buttonText}</button>
//   );
// }

// export default OpenModalButton;
