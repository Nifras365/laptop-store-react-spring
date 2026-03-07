import React from 'react';
import { Link } from 'react-router-dom';
import './ui.css';

const EmptyState = ({ 
    icon,
    title = 'Nothing here yet',
    message,
    actionLabel,
    actionLink,
    onAction
}) => {
    return (
        <div className="empty-state">
            {icon && (
                <div className="empty-state-icon">
                    {icon}
                </div>
            )}
            <h3 className="empty-state-title">{title}</h3>
            {message && (
                <p className="empty-state-message">{message}</p>
            )}
            {actionLabel && (actionLink || onAction) && (
                actionLink ? (
                    <Link to={actionLink} className="empty-state-action btn-primary">
                        {actionLabel}
                    </Link>
                ) : (
                    <button onClick={onAction} className="empty-state-action btn-primary">
                        {actionLabel}
                    </button>
                )
            )}
        </div>
    );
};

export default EmptyState;
