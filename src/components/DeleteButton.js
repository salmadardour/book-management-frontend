import React, { useState } from 'react';
import PropTypes from 'prop-types';
import './DeleteButton.css';

function DeleteButton({ itemName, onDelete, isDeleting = false }) {
  const [showConfirmation, setShowConfirmation] = useState(false);

  const handleClick = () => {
    setShowConfirmation(true);
  };

  const handleCancel = () => {
    setShowConfirmation(false);
  };

  const handleConfirm = () => {
    onDelete();
    setShowConfirmation(false);
  };

  return (
    <>
      <button 
        className="delete-button" 
        onClick={handleClick}
        disabled={isDeleting}
      >
        <span className="delete-icon">🗑️</span>
        {isDeleting ? 'Deleting...' : 'Delete'}
      </button>

      {showConfirmation && (
        <div className="delete-modal-backdrop">
          <div className="delete-modal">
            <h3 className="delete-modal-title">Confirm Deletion</h3>
            <p className="delete-modal-message">
              Are you sure you want to delete {itemName}? This action cannot be undone.
            </p>
            <div className="delete-modal-actions">
              <button className="delete-modal-cancel" onClick={handleCancel}>
                Cancel
              </button>
              <button className="delete-modal-confirm" onClick={handleConfirm}>
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

DeleteButton.propTypes = {
  itemName: PropTypes.string.isRequired,
  onDelete: PropTypes.func.isRequired,
  isDeleting: PropTypes.bool
};

export default DeleteButton;