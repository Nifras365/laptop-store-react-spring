import React from 'react';
import { IoAlertCircle, IoClose } from 'react-icons/io5';
import './ui.css';

const ErrorBanner = ({ 
    message = 'Something went wrong. Please try again.',
    onDismiss,
    type = 'error' // error, warning, info
}) => {
    const typeClasses = {
        error: 'error-banner-error',
        warning: 'error-banner-warning',
        info: 'error-banner-info'
    };

    return (
        <div className={`error-banner ${typeClasses[type]}`} role="alert">
            <div className="error-banner-content">
                <IoAlertCircle size={20} className="error-banner-icon" />
                <span className="error-banner-message">{message}</span>
            </div>
            {onDismiss && (
                <button 
                    type="button"
                    className="error-banner-dismiss"
                    onClick={onDismiss}
                    aria-label="Dismiss"
                >
                    <IoClose size={18} />
                </button>
            )}
        </div>
    );
};

export default ErrorBanner;
