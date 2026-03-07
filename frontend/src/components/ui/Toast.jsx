import React, { useState, useEffect } from 'react';
import { IoCheckmarkCircle, IoClose, IoAlertCircle, IoInformationCircle } from 'react-icons/io5';
import './ui.css';

const Toast = ({ 
    message, 
    type = 'success', // success, error, warning, info
    duration = 4000,
    onClose 
}) => {
    const [isVisible, setIsVisible] = useState(true);

    useEffect(() => {
        if (duration > 0) {
            const timer = setTimeout(() => {
                setIsVisible(false);
                setTimeout(onClose, 300);
            }, duration);
            return () => clearTimeout(timer);
        }
    }, [duration, onClose]);

    const handleClose = () => {
        setIsVisible(false);
        setTimeout(onClose, 300);
    };

    const icons = {
        success: <IoCheckmarkCircle size={20} />,
        error: <IoAlertCircle size={20} />,
        warning: <IoAlertCircle size={20} />,
        info: <IoInformationCircle size={20} />
    };

    return (
        <div className={`toast toast-${type} ${isVisible ? 'toast-enter' : 'toast-exit'}`}>
            <span className="toast-icon">{icons[type]}</span>
            <span className="toast-message">{message}</span>
            <button className="toast-close" onClick={handleClose} aria-label="Close">
                <IoClose size={16} />
            </button>
        </div>
    );
};

// Toast Container for managing multiple toasts
export const ToastContainer = ({ toasts, removeToast }) => {
    return (
        <div className="toast-container">
            {toasts.map((toast) => (
                <Toast
                    key={toast.id}
                    message={toast.message}
                    type={toast.type}
                    duration={toast.duration}
                    onClose={() => removeToast(toast.id)}
                />
            ))}
        </div>
    );
};

export default Toast;
