import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Container, Row, Col } from "react-bootstrap";
import apiClient from "../api/client";
import FetchedCartCard from "../components/FetchedCartCard";
import { useAuth } from "../auth/AuthContext";
import { PageShell, PageHeader, LoadingState, EmptyState, ErrorBanner, ConfirmModal } from "../components/ui";
import '../pagescss/cart.css';

const Cart = () => {
    const navigate = useNavigate();
    const [cartItems, setCartItems] = useState([]);
    const [laptopDetails, setLaptopDetails] = useState({});
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [checkoutLoading, setCheckoutLoading] = useState(false);
    const [deleteConfirm, setDeleteConfirm] = useState({ show: false, cartID: null, itemName: '' });
    const { userID } = useAuth();
    const laptopCache = useRef({});

    // Calculate totals
    const subtotal = cartItems.reduce((sum, item) => sum + item.totalPrice, 0);
    const itemCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);

    const formatPrice = (price) => {
        return new Intl.NumberFormat('en-US', {
            style: 'decimal',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0
        }).format(price);
    };

    const handleCheckout = async () => {
        if (cartItems.length === 0) return;
        
        setCheckoutLoading(true);
        setError('');

        try {
            const orderDTO = {
                userID: parseInt(userID),
                finalPrice: subtotal,
                orderItemDTOS: cartItems.map(item => ({
                    laptopID: item.laptopID,
                    quantity: item.quantity,
                    totalPrice: item.totalPrice
                }))
            };

            const response = await apiClient.post('/orders/create', orderDTO);

            if (response.status >= 200 && response.status < 300) {
                await apiClient.delete(`/cart/user/${userID}`);
                setCartItems([]);
                navigate('/orders', { state: { orderSuccess: true } });
            } else {
                throw new Error("Failed to create the order.");
            }
        } catch (error) {
            setError("Failed to place order. Please try again.");
        } finally {
            setCheckoutLoading(false);
        }
    };

    const handleDeleteClick = (cartID, itemName) => {
        setDeleteConfirm({ show: true, cartID, itemName });
    };

    const confirmDelete = async () => {
        const { cartID } = deleteConfirm;
        setDeleteConfirm({ show: false, cartID: null, itemName: '' });
        
        try {
            await apiClient.delete(`/cart/delete/${cartID}`);
            setCartItems(cartItems.filter(item => item.cartID !== cartID));
        } catch (error) {
            setError("Failed to remove item. Please try again.");
        }
    };

    const updateQuantity = async (cartID, laptopID, newQuantity) => {
        if (newQuantity < 1) return;
        
        const laptop = laptopDetails[laptopID];
        if (!laptop) return;

        // Check stock limit
        if (newQuantity > laptop.stockQuantity) {
            setError(`Only ${laptop.stockQuantity} units available in stock.`);
            return;
        }

        try {
            const newTotalPrice = laptop.price * newQuantity;
            
            await apiClient.put(`/cart/update/${cartID}`, {
                quantity: newQuantity,
                totalPrice: newTotalPrice
            });

            setCartItems(cartItems.map(item => 
                item.cartID === cartID 
                    ? { ...item, quantity: newQuantity, totalPrice: newTotalPrice }
                    : item
            ));
        } catch (error) {
            setError("Failed to update quantity. Please try again.");
        }
    };

    useEffect(() => {
        async function fetchCarts() {
            setLoading(true);
            try {
                const response = await apiClient.get(`/cart/user/${userID}`);
                setCartItems(response.data.data || []);
            } catch (error) {
                if (error.response?.status !== 404) {
                    setError("Failed to load your cart. Please refresh the page.");
                }
            } finally {
                setLoading(false);
            }
        }

        if (userID) {
            fetchCarts();
        }
    }, [userID]);

    useEffect(() => {
        async function fetchLaptopDetails(cartItems) {
            const uniqueIds = [...new Set(cartItems.map(item => item.laptopID))];
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

        if (cartItems.length > 0) {
            fetchLaptopDetails(cartItems);
        }
    }, [cartItems]);

    if (loading) {
        return (
            <PageShell>
                <LoadingState message="Loading your cart..." fullPage />
            </PageShell>
        );
    }

    return (
        <PageShell>
            <PageHeader
                title="Shopping Cart"
                subtitle={itemCount > 0 ? `${itemCount} item${itemCount !== 1 ? 's' : ''} in your cart` : null}
                showBack
            />

            {error && (
                <ErrorBanner
                    message={error}
                    onDismiss={() => setError('')}
                />
            )}

            {cartItems.length === 0 ? (
                <EmptyState
                    icon="cart"
                    title="Your cart is empty"
                    message="Looks like you haven't added any laptops to your cart yet."
                    actionText="Browse Laptops"
                    actionLink="/"
                />
            ) : (
                <Row className="cart-layout">
                    <Col lg={8}>
                        <div className="cart-items">
                            {cartItems.map((cartItem) => (
                                <FetchedCartCard
                                    key={cartItem.cartID}
                                    laptop={laptopDetails[cartItem.laptopID]}
                                    totalPrice={cartItem.totalPrice}
                                    quantity={cartItem.quantity}
                                    onDelete={() => handleDeleteClick(
                                        cartItem.cartID,
                                        laptopDetails[cartItem.laptopID]?.model || 'this item'
                                    )}
                                    onQuantityChange={(newQty) => updateQuantity(
                                        cartItem.cartID,
                                        cartItem.laptopID,
                                        newQty
                                    )}
                                />
                            ))}
                        </div>
                    </Col>

                    <Col lg={4}>
                        <div className="order-summary">
                            <h3 className="summary-title">Order Summary</h3>
                            
                            <div className="summary-row">
                                <span>Subtotal ({itemCount} items)</span>
                                <span>{formatPrice(subtotal)} LKR</span>
                            </div>
                            
                            <div className="summary-row">
                                <span>Shipping</span>
                                <span className="free-shipping">Free</span>
                            </div>

                            <hr className="summary-divider" />

                            <div className="summary-row summary-total">
                                <span>Total</span>
                                <span>{formatPrice(subtotal)} LKR</span>
                            </div>

                            <button
                                className="checkout-btn"
                                onClick={handleCheckout}
                                disabled={checkoutLoading || cartItems.length === 0}
                            >
                                {checkoutLoading ? (
                                    <>
                                        <span className="loading-spinner loading-spinner-sm"></span>
                                        <span>Processing...</span>
                                    </>
                                ) : (
                                    'Proceed to Checkout'
                                )}
                            </button>

                            <p className="checkout-note">
                                Secure checkout • Free shipping on all orders
                            </p>
                        </div>
                    </Col>
                </Row>
            )}

            <ConfirmModal
                show={deleteConfirm.show}
                title="Remove Item"
                message={`Are you sure you want to remove "${deleteConfirm.itemName}" from your cart?`}
                confirmText="Remove"
                variant="danger"
                onConfirm={confirmDelete}
                onCancel={() => setDeleteConfirm({ show: false, cartID: null, itemName: '' })}
            />
        </PageShell>
    );
};

export default Cart;
