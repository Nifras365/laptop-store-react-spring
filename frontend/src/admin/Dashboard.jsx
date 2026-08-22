import React, { useState } from "react";
import './css/Dashboard.css';
import AddLaptops from "./components/AddLaptops.jsx";
import ManageLaptops from "./components/ManageLaptops.jsx";
import ViewUsers from "./components/ViewUsers.jsx";
import ManageUsers from "./components/ManageUsers.jsx";
import ManageOrders from "./components/ManageOrders.jsx";
import SideBar from "./components/SideBar.jsx";
import { FaLaptop, FaUsers, FaPlus, FaCog, FaBoxOpen, FaChartLine } from "react-icons/fa";
import apiClient from "../api/client";

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
            case 'manage-orders':
                return <ManageOrders />;
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
    const [stats, setStats] = useState({ revenue: 0, users: 0, laptops: 0, orders: 0 });
    const [loading, setLoading] = useState(true);

    React.useEffect(() => {
        const fetchStats = async () => {
            try {
                const [usersRes, laptopsRes, ordersRes] = await Promise.all([
                    apiClient.get('/users/get-all'),
                    apiClient.get('/laptops/get-all'),
                    apiClient.get('/orders/get-all')
                ]);
                
                const orders = ordersRes.data.data || [];
                const revenue = orders.filter(o => o.status !== 'CANCELLED').reduce((sum, o) => sum + (o.finalPrice || 0), 0);

                setStats({
                    users: (usersRes.data.data || []).length,
                    laptops: (laptopsRes.data.data || []).length,
                    orders: orders.length,
                    revenue: revenue
                });
            } catch (err) {
                console.error("Failed to fetch dashboard stats", err);
            } finally {
                setLoading(false);
            }
        };
        fetchStats();
    }, []);

    const quickActions = [
        { id: 'add-laptops', label: 'Add New Laptop', icon: FaPlus, color: 'var(--success)' },
        { id: 'manage-laptops', label: 'Manage Laptops', icon: FaLaptop, color: 'var(--primary)' },
        { id: 'manage-users', label: 'Manage Users', icon: FaUsers, color: 'var(--danger)' },
        { id: 'manage-orders', label: 'Manage Orders', icon: FaBoxOpen, color: 'var(--warning)' },
    ];

    return (
        <div className="dashboard-home">
            <div className="dashboard-header">
                <h1>Admin Dashboard</h1>
                <p>Welcome to the laptop store admin panel</p>
            </div>

            {!loading && (
                <div className="dashboard-stats" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px', marginBottom: '30px' }}>
                    <div className="stat-card" style={{ background: 'var(--card-bg)', padding: '20px', borderRadius: '12px', boxShadow: '0 4px 6px rgba(0,0,0,0.05)', border: '1px solid var(--border-color)', display: 'flex', alignItems: 'center' }}>
                        <div style={{ background: 'rgba(59, 130, 246, 0.1)', color: '#3b82f6', padding: '15px', borderRadius: '10px', marginRight: '15px' }}><FaChartLine size={24} /></div>
                        <div><p style={{ margin: 0, fontSize: '0.9rem', color: 'var(--text-secondary)' }}>Total Revenue</p><h3 style={{ margin: '5px 0 0', fontSize: '1.2rem', color: 'var(--text-primary)' }}>{new Intl.NumberFormat('en-US').format(stats.revenue)} LKR</h3></div>
                    </div>
                    <div className="stat-card" style={{ background: 'var(--card-bg)', padding: '20px', borderRadius: '12px', boxShadow: '0 4px 6px rgba(0,0,0,0.05)', border: '1px solid var(--border-color)', display: 'flex', alignItems: 'center' }}>
                        <div style={{ background: 'rgba(239, 68, 68, 0.1)', color: '#ef4444', padding: '15px', borderRadius: '10px', marginRight: '15px' }}><FaUsers size={24} /></div>
                        <div><p style={{ margin: 0, fontSize: '0.9rem', color: 'var(--text-secondary)' }}>Total Users</p><h3 style={{ margin: '5px 0 0', fontSize: '1.5rem', color: 'var(--text-primary)' }}>{stats.users}</h3></div>
                    </div>
                    <div className="stat-card" style={{ background: 'var(--card-bg)', padding: '20px', borderRadius: '12px', boxShadow: '0 4px 6px rgba(0,0,0,0.05)', border: '1px solid var(--border-color)', display: 'flex', alignItems: 'center' }}>
                        <div style={{ background: 'rgba(16, 185, 129, 0.1)', color: '#10b981', padding: '15px', borderRadius: '10px', marginRight: '15px' }}><FaLaptop size={24} /></div>
                        <div><p style={{ margin: 0, fontSize: '0.9rem', color: 'var(--text-secondary)' }}>Total Laptops</p><h3 style={{ margin: '5px 0 0', fontSize: '1.5rem', color: 'var(--text-primary)' }}>{stats.laptops}</h3></div>
                    </div>
                    <div className="stat-card" style={{ background: 'var(--card-bg)', padding: '20px', borderRadius: '12px', boxShadow: '0 4px 6px rgba(0,0,0,0.05)', border: '1px solid var(--border-color)', display: 'flex', alignItems: 'center' }}>
                        <div style={{ background: 'rgba(245, 158, 11, 0.1)', color: '#f59e0b', padding: '15px', borderRadius: '10px', marginRight: '15px' }}><FaBoxOpen size={24} /></div>
                        <div><p style={{ margin: 0, fontSize: '0.9rem', color: 'var(--text-secondary)' }}>Total Orders</p><h3 style={{ margin: '5px 0 0', fontSize: '1.5rem', color: 'var(--text-primary)' }}>{stats.orders}</h3></div>
                    </div>
                </div>
            )}

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
        </div>
    );
};

export default Dashboard;