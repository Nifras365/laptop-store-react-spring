import React, { useState, useEffect } from "react";
import '../css/ManageUsers.css'; // Reusing similar table styles
import apiClient from '../../api/client';
import { Spinner, Form } from "react-bootstrap";
import { FaBoxOpen, FaSearch } from "react-icons/fa";

const ManageOrders = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        fetchOrders();
    }, []);

    const fetchOrders = async () => {
        try {
            const response = await apiClient.get('/orders/get-all');
            setOrders(response.data.data || []);
        } catch (err) {
            console.error('Failed to fetch orders:', err);
            setError('Failed to load orders. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const handleStatusChange = async (orderId, newStatus) => {
        try {
            await apiClient.put(`/orders/${orderId}/status?status=${newStatus}`);
            fetchOrders(); // refresh list
        } catch (err) {
            console.error('Failed to update order status:', err);
            alert('Failed to update order status.');
        }
    };

    const filteredOrders = orders.filter(order => 
        order.orderId.toString().includes(searchTerm) ||
        (order.status && order.status.toLowerCase().includes(searchTerm.toLowerCase()))
    );

    if (loading) {
        return (
            <div className="manage-users-loading">
                <Spinner animation="border" variant="primary" />
                <p>Loading orders...</p>
            </div>
        );
    }

    return (
        <div className="manage-users-container">
            <div className="manage-users-header">
                <h2>Manage Orders</h2>
                <p>{orders.length} total order{orders.length !== 1 ? 's' : ''}</p>
            </div>

            {error && (
                <div className="error-banner">
                    <span>{error}</span>
                    <button onClick={() => setError('')}>&times;</button>
                </div>
            )}

            <div className="search-bar-container" style={{ marginBottom: '20px', display: 'flex', alignItems: 'center', background: 'var(--card-bg)', padding: '10px 15px', borderRadius: '8px', border: '1px solid var(--border-color)' }}>
                <FaSearch style={{ color: 'var(--text-secondary)', marginRight: '10px' }} />
                <input 
                    type="text" 
                    placeholder="Search by Order ID or Status..." 
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    style={{ border: 'none', background: 'transparent', outline: 'none', width: '100%', color: 'var(--text-primary)' }}
                />
            </div>

            {filteredOrders.length === 0 ? (
                <div className="empty-state">
                    <FaBoxOpen className="empty-icon" />
                    <h3>No orders found</h3>
                    <p>There are no orders matching your criteria</p>
                </div>
            ) : (
                <div className="users-table-container">
                    <table className="users-table">
                        <thead>
                            <tr>
                                <th>Order ID</th>
                                <th>Items</th>
                                <th>Total Price</th>
                                <th>Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredOrders.map((order) => (
                                <tr key={order.orderId}>
                                    <td><strong>#{order.orderId}</strong></td>
                                    <td>
                                        <ul style={{ listStyleType: 'none', padding: 0, margin: 0 }}>
                                            {order.orderItemDTOS?.map(item => (
                                                <li key={item.laptopID} style={{ fontSize: '0.85rem' }}>
                                                    {item.quantity}x {item.title || `Laptop ${item.laptopID}`}
                                                </li>
                                            ))}
                                        </ul>
                                    </td>
                                    <td>{new Intl.NumberFormat('en-US').format(order.finalPrice)} LKR</td>
                                    <td>
                                        <Form.Select 
                                            size="sm" 
                                            value={order.status || 'PLACED'} 
                                            onChange={(e) => handleStatusChange(order.orderId, e.target.value)}
                                            style={{ width: '130px' }}
                                        >
                                            <option value="PLACED">PLACED</option>
                                            <option value="PROCESSING">PROCESSING</option>
                                            <option value="DELIVERED">DELIVERED</option>
                                            <option value="CANCELLED">CANCELLED</option>
                                        </Form.Select>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
};

export default ManageOrders;
