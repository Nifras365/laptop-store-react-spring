import React from 'react';
import { IoArrowBack } from 'react-icons/io5';
import { useNavigate } from 'react-router-dom';
import './ui.css';

const PageHeader = ({ 
    title, 
    subtitle, 
    showBack = false, 
    onBack,
    actions 
}) => {
    const navigate = useNavigate();

    const handleBack = () => {
        if (onBack) {
            onBack();
        } else {
            navigate(-1);
        }
    };

    return (
        <div className="page-header">
            <div className="page-header-left">
                {showBack && (
                    <button 
                        type="button" 
                        className="page-header-back"
                        onClick={handleBack}
                        aria-label="Go back"
                    >
                        <IoArrowBack size={20} />
                    </button>
                )}
                <div className="page-header-text">
                    <h1 className="page-header-title">{title}</h1>
                    {subtitle && (
                        <p className="page-header-subtitle">{subtitle}</p>
                    )}
                </div>
            </div>
            {actions && (
                <div className="page-header-actions">
                    {actions}
                </div>
            )}
        </div>
    );
};

export default PageHeader;
