import React, { useEffect, useState, useRef } from "react";
import { useLocation } from "react-router-dom";
import { Container, Row, Col, Collapse } from "react-bootstrap";
import { IoChevronDown, IoChevronUp, IoCheckmarkCircle } from "react-icons/io5";
import apiClient from "../api/client";
import "../pagescss/Orders.css";
import { useAuth } from "../auth/AuthContext";
import { PageShell, PageHeader, LoadingState, EmptyState, ErrorBanner } from "../components/ui";

const Orders = () => {
    const [orders, setOrders] = useState([]);
    const [laptopDetails, setLaptopDetails] = useState({});
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [expandedOrders, setExpandedOrders] = useState({});
    const [showSuccessMessage, setShowSuccessMessage] = useState(false);
    const { userID } = useAuth();
    const location = useLocation();
    const laptopCache = useRef({});

    const formatPrice = (price) => {
        return new Intl.NumberFormat('en-US', {
            style: 'decimal',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0
        }).format(price);
    };

    const formatDate = (dateString) => {
        if (!dateString) return 'N/A';
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    const toggleOrder = (orderId) => {
        setExpandedOrders(prev => ({
            ...prev,
            [orderId]: !prev[orderId]
        }));
    };

    const handleCancelOrder = async (orderId) => {
        if (!window.confirm("Are you sure you want to cancel this order?")) return;
        try {
            await apiClient.put(`/orders/${orderId}/cancel`);
            setOrders(orders.map(o => o.orderId === orderId ? { ...o, status: 'CANCELLED' } : o));
        } catch (error) {
            setError(error.response?.data?.message || "Failed to cancel order");
        }
    };

    const handleDeleteOrder = async (orderId) => {
        if (!window.confirm("Are you sure you want to delete this order from your history?")) return;
        try {
            await apiClient.delete(`/orders/${orderId}`);
            setOrders(orders.filter(o => o.orderId !== orderId));
        } catch (error) {
            setError(error.response?.data?.message || "Failed to delete order");
        }
    };

    useEffect(() => {
        // Show success message if redirected from checkout
        if (location.state?.orderSuccess) {
            setShowSuccessMessage(true);
            // Clear the state to prevent showing message on refresh
            window.history.replaceState({}, document.title);
            setTimeout(() => setShowSuccessMessage(false), 5000);
        }
    }, [location.state]);

    useEffect(() => {
        async function fetchOrders() {
            try {
                const response = await apiClient.get(`/orders/user/${userID}`);
                const ordersData = response.data.data || [];
                setOrders(ordersData);
                
                // Expand the first order by default
                if (ordersData.length > 0) {
                    setExpandedOrders({ [ordersData[0].orderId]: true });
                }
            } catch (error) {
                if (error.response?.status !== 404) {
                    setError("Failed to load your orders. Please try again.");
                }
            } finally {
                setLoading(false);
            }
        }

        if (userID) {
            fetchOrders();
        }
    }, [userID]);

    // Fetch laptop details for all order items
    useEffect(() => {
        async function fetchLaptopDetails() {
            const allLaptopIds = orders.flatMap(order => 
                order.orderItemDTOS?.map(item => item.laptopID) || []
            );
            const uniqueIds = [...new Set(allLaptopIds)];
            const idsToFetch = uniqueIds.filter(id => !laptopCache.current[id]);

            if (idsToFetch.length > 0) {
                const fetchPromises = idsToFetch.map(id =>
                    apiClient.get(`/laptops/${id}`)
                        .then(response => ({ id, data: response.data }))
                        .catch(() => ({ id, data: null }))
                );

                const results = await Promise.all(fetchPromises);
                results.forEach(({ id, data }) => {
                    if (data) {
                        laptopCache.current[id] = data;
                    }
                });
            }

            const laptops = {};
            uniqueIds.forEach(id => {
                if (laptopCache.current[id]) {
                    laptops[id] = laptopCache.current[id];
                }
            });
            setLaptopDetails(laptops);
        }

        if (orders.length > 0) {
            fetchLaptopDetails();
        }
    }, [orders]);

    if (loading) {
        return (
            <PageShell>
                <LoadingState message="Loading your orders..." fullPage />
            </PageShell>
        );
    }

    return (
        <PageShell>
            <PageHeader
                title="My Orders"
                subtitle={orders.length > 0 ? `${orders.length} order${orders.length !== 1 ? 's' : ''} placed` : null}
                showBack
            />

            {showSuccessMessage && (
                <div className="order-success-banner">
                    <IoCheckmarkCircle size={24} />
                    <span>Your order has been placed successfully!</span>
                </div>
            )}

            {error && (
                <ErrorBanner
                    message={error}
                    onDismiss={() => setError('')}
                />
            )}

            {orders.length === 0 ? (
                <EmptyState
                    icon="package"
                    title="No orders yet"
                    message="You haven't placed any orders yet. Start shopping to see your orders here."
                    actionText="Browse Laptops"
                    actionLink="/"
                />
            ) : (
                <div className="orders-list">
                    {orders.map((order) => (
                        <div key={order.orderId} className="order-card">
                            <div 
                                className="order-header"
                                onClick={() => toggleOrder(order.orderId)}
                            >
                                <div className="order-header-left">
                                    <span className="order-number">Order #{order.orderId}</span>
                                    {order.createdAt && (
                                        <span className="order-date">{formatDate(order.createdAt)}</span>
                                    )}
                                    <span className={`order-status status-${(order.status || 'PLACED').toLowerCase()}`}>
                                        {order.status || 'PLACED'}
                                    </span>
                                    <span className="order-title">{order.orderItemDTOS?.[0]?.title}</span>
                                </div>
                                <div className="order-header-right">
                                    <span className="order-total">{formatPrice(order.finalPrice)} LKR</span>
                                    <span className="order-items-count">
                                        {(() => { const totalItems = order.orderItemDTOS?.reduce((sum, item) => sum + (item?.quantity ?? 0), 0) ?? 0; return `${totalItems} item${totalItems !== 1 ? 's' : ''}`; })()}
                                    </span>
                                    <span className="order-toggle">
                                        {expandedOrders[order.orderId] ? <IoChevronUp /> : <IoChevronDown />}
                                    </span>
                                </div>
                            </div>

                            <Collapse in={expandedOrders[order.orderId]}>
                                <div className="order-details">
                                    <div className="order-items">
                                        {order.orderItemDTOS?.map((item, index) => {
                                            const laptop = laptopDetails[item.laptopID];
                                            return (
                                                <div key={index} className="order-item">
                                                    <div className="order-item-img-container">
                                                        {laptop?.image ? (
                                                            <img 
                                                                src={laptop.image} 
                                                                alt={laptop.model}
                                                                className="order-item-img"
                                                            />
                                                        ) : (
                                                            <div className="order-item-img-placeholder"></div>
                                                        )}
                                                    </div>
                                                    <div className="order-item-info">
                                                        <span className="order-item-brand">
                                                            {laptop?.brand || 'Unknown Brand'}
                                                        </span>
                                                        <span className="order-item-name">
                                                            {laptop?.model || `Laptop #${item.laptopID}`}
                                                        </span>
                                                        <span className="order-item-qty">
                                                            Qty: {item.quantity}
                                                        </span>
                                                    </div>
                                                    <div className="order-item-price">
                                                        {formatPrice(item.totalPrice)} LKR
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>

                                    <div className="order-summary-row">
                                        <span className="order-summary-label">Order Total</span>
                                        <span className="order-summary-value">{formatPrice(order.finalPrice)} LKR</span>
                                    </div>

                                    <div className="order-actions">
                                        {(!order.status || order.status === 'PLACED' || order.status === 'PROCESSING') && (
                                            <button 
                                                className="btn btn-outline-danger btn-sm"
                                                onClick={() => handleCancelOrder(order.orderId)}
                                            >
                                                Cancel Order
                                            </button>
                                        )}
                                        {(order.status === 'CANCELLED' || order.status === 'DELIVERED') && (
                                            <button 
                                                className="btn btn-outline-secondary btn-sm"
                                                onClick={() => handleDeleteOrder(order.orderId)}
                                            >
                                                Delete History
                                            </button>
                                        )}
                                    </div>
                                </div>
                            </Collapse>
                        </div>
                    ))}
                </div>
            )}
        </PageShell>
    );
};

export default Orders;
