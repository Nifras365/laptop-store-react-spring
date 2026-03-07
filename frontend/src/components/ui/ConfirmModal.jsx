import React from 'react';
import { IoClose } from 'react-icons/io5';
import './ui.css';

const noop = () => {};

const ConfirmModal = (props) => {

    const {
        isOpen,
        show,
        title = 'Confirm Action',
        message = 'Are you sure you want to proceed?',
        confirmLabel,
        confirmText,
        cancelLabel,
        cancelText,
        variant = 'danger', 
        onConfirm,
        onCancel,
        onHide
    } = props;

    const open = typeof isOpen === 'boolean' ? isOpen : Boolean(show);
    const handleCancel = onCancel || onHide || noop;
    const confirm = confirmLabel ?? confirmText ?? 'Confirm';
    const cancel = cancelLabel ?? cancelText ?? 'Cancel';

    if (!open) return null;

    return (
        <div className="modal-overlay" onClick={handleCancel}>
            <div className="confirm-modal" onClick={e => e.stopPropagation()}>
                <div className="confirm-modal-header">
                    <h3 className="confirm-modal-title">{title}</h3>
                    <button 
                        type="button"
                        className="confirm-modal-close"
                        onClick={handleCancel}
                        aria-label="Close"
                    >
                        <IoClose size={20} />
                    </button>
                </div>
                <div className="confirm-modal-body">
                    <p>{message}</p>
                </div>
                <div className="confirm-modal-footer">
                    <button 
                        type="button"
                        className="btn-secondary"
                        onClick={handleCancel}
                    >
                        {cancel}
                    </button>
                    <button 
                        type="button"
                        className={variant === 'danger' ? 'btn-danger' : 'btn-primary'}
                        onClick={onConfirm || noop}
                    >
                        {confirm}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ConfirmModal;
