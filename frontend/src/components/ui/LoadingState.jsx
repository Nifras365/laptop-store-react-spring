import React from 'react';
import './ui.css';

const LoadingState = ({ 
    message = 'Loading...', 
    size = 'md',
    fullPage = false 
}) => {
    const sizeClasses = {
        sm: 'loading-spinner-sm',
        md: 'loading-spinner-md',
        lg: 'loading-spinner-lg'
    };

    return (
        <div className={`loading-state ${fullPage ? 'loading-state-fullpage' : ''}`}>
            <div className={`loading-spinner ${sizeClasses[size]}`}></div>
            {message && <p className="loading-message">{message}</p>}
        </div>
    );
};

export default LoadingState;
