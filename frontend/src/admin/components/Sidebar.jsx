import React from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../auth/AuthContext";
import '../css/SideBar.css';
import { 
    FaLaptop, 
    FaPlus, 
    FaCog, 
    FaUsers, 
    FaEye, 
    FaSignOutAlt,
    FaHome,
    FaChevronDown
} from "react-icons/fa";

const SideBar = ({ selectedComponent, setSelectedComponent }) => {
    const navigate = useNavigate();
    const { logout } = useAuth();
    const [laptopsOpen, setLaptopsOpen] = React.useState(true);
    const [usersOpen, setUsersOpen] = React.useState(true);

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    const isActive = (id) => selectedComponent === id;

    return (
        <aside className="admin-sidebar">
            <div className="sidebar-header">
                <div className="sidebar-brand">
                    <FaLaptop className="brand-icon" />
                    <span>Admin Panel</span>
                </div>
            </div>

            <nav className="sidebar-nav">
                <button 
                    className={`nav-item ${!selectedComponent ? 'active' : ''}`}
                    onClick={() => setSelectedComponent(null)}
                >
                    <FaHome className="nav-icon" />
                    <span>Dashboard</span>
                </button>

                <div className="nav-section">
                    <button 
                        className="nav-section-header"
                        onClick={() => setLaptopsOpen(!laptopsOpen)}
                    >
                        <div className="section-title">
                            <FaLaptop className="nav-icon" />
                            <span>Laptops</span>
                        </div>
                        <FaChevronDown className={`chevron ${laptopsOpen ? 'open' : ''}`} />
                    </button>
                    {laptopsOpen && (
                        <div className="nav-section-items">
                            <button
                                className={`nav-item sub-item ${isActive('add-laptops') ? 'active' : ''}`}
                                onClick={() => setSelectedComponent('add-laptops')}
                            >
                                <FaPlus className="nav-icon" />
                                <span>Add Laptop</span>
                            </button>
                            <button
                                className={`nav-item sub-item ${isActive('manage-laptops') ? 'active' : ''}`}
                                onClick={() => setSelectedComponent('manage-laptops')}
                            >
                                <FaCog className="nav-icon" />
                                <span>Manage Laptops</span>
                            </button>
                        </div>
                    )}
                </div>

                <div className="nav-section">
                    <button 
                        className="nav-section-header"
                        onClick={() => setUsersOpen(!usersOpen)}
                    >
                        <div className="section-title">
                            <FaUsers className="nav-icon" />
                            <span>Users</span>
                        </div>
                        <FaChevronDown className={`chevron ${usersOpen ? 'open' : ''}`} />
                    </button>
                    {usersOpen && (
                        <div className="nav-section-items">
                            <button
                                className={`nav-item sub-item ${isActive('view-users') ? 'active' : ''}`}
                                onClick={() => setSelectedComponent('view-users')}
                            >
                                <FaEye className="nav-icon" />
                                <span>View Users</span>
                            </button>
                            <button
                                className={`nav-item sub-item ${isActive('manage-users') ? 'active' : ''}`}
                                onClick={() => setSelectedComponent('manage-users')}
                            >
                                <FaCog className="nav-icon" />
                                <span>Manage Users</span>
                            </button>
                        </div>
                    )}
                </div>
            </nav>

            <div className="sidebar-footer">
                <button className="logout-btn" onClick={handleLogout}>
                    <FaSignOutAlt className="nav-icon" />
                    <span>Logout</span>
                </button>
            </div>
        </aside>
    );
};

export default SideBar;
