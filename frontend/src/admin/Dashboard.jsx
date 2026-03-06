import React, { useState } from "react";
import './css/Dashboard.css';
import AddLaptops from "./components/AddLaptops.jsx";
import ManageLaptops from "./components/ManageLaptops.jsx";
import ViewUsers from "./components/ViewUsers.jsx";
import ManageUsers from "./components/ManageUsers.jsx";
import SideBar from "./components/SideBar.jsx";
import { FaLaptop, FaUsers, FaPlus, FaCog } from "react-icons/fa";

const Dashboard = () => {
    const [selectedComponent, setSelectedComponent] = useState(null);

    const selectComponent = () => {
        switch(selectedComponent) {
            case 'add-laptops':
                return <AddLaptops />;
            case 'manage-laptops':
                return <ManageLaptops />;
            case 'view-users':
                return <ViewUsers />;
            case 'manage-users':
                return <ManageUsers />;
            default:
                return <DashboardHome onNavigate={setSelectedComponent} />;
        }
    };

    return (
        <div className="dashboard-container">
            <SideBar 
                selectedComponent={selectedComponent} 
                setSelectedComponent={setSelectedComponent}
            />
            <main className="dashboard-main">
                {selectComponent()}
            </main>
        </div>
    );
};

// Dashboard Home - shown when no component is selected
const DashboardHome = ({ onNavigate }) => {
    const quickActions = [
        { id: 'add-laptops', label: 'Add New Laptop', icon: FaPlus, color: 'var(--success)' },
        { id: 'manage-laptops', label: 'Manage Laptops', icon: FaLaptop, color: 'var(--primary)' },
        { id: 'view-users', label: 'View Users', icon: FaUsers, color: 'var(--warning)' },
        { id: 'manage-users', label: 'Manage Users', icon: FaCog, color: 'var(--danger)' },
    ];

    return (
        <div className="dashboard-home">
            <div className="dashboard-header">
                <h1>Admin Dashboard</h1>
                <p>Welcome to the laptop store admin panel</p>
            </div>

            <div className="quick-actions">
                <h2>Quick Actions</h2>
                <div className="action-grid">
                    {quickActions.map((action) => {
                        const IconComponent = action.icon;
                        return (
                            <button
                                key={action.id}
                                className="action-card"
                                onClick={() => onNavigate(action.id)}
                            >
                                <div 
                                    className="action-icon" 
                                    style={{ backgroundColor: action.color }}
                                >
                                    <IconComponent />
                                </div>
                                <span>{action.label}</span>
                            </button>
                        );
                    })}
                </div>
            </div>

            <div className="dashboard-info">
                <div className="info-card">
                    <FaLaptop className="info-icon" />
                    <div>
                        <h3>Laptops</h3>
                        <p>Add, edit, or remove laptops from the store inventory</p>
                    </div>
                </div>
                <div className="info-card">
                    <FaUsers className="info-icon" />
                    <div>
                        <h3>Users</h3>
                        <p>View and manage registered users</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;