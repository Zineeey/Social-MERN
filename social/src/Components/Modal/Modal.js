import React from 'react';
import './Modal.css'; 

const Modal = ({ children, isVisible, onClose }) => {
    if (!isVisible) return null;

    return (
        <div className="modal-overlay">
            <div className="modal-content">
                <button className="modal-close-button" onClick={onClose}>
                    &times;
                </button>
                {children}
            </div>
        </div>
    );
};

export default Modal;
