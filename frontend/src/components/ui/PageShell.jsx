import React from 'react';
import './ui.css';

const PageShell = ({ children, className = '' }) => {
    return (
        <div className={`page-shell ${className}`}>
            <div className="page-shell-content">
                {children}
            </div>
        </div>
    );
};

export default PageShell;
