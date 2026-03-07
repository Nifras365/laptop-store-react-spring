import React, { useState } from "react";
import './css/CartCard.css';
import { Card, Col, Row, Button } from "react-bootstrap";
import { FaCircleMinus, FaCirclePlus } from "react-icons/fa6";
import { IoCartOutline, IoCheckmarkCircle } from "react-icons/io5";
import { useNavigate } from "react-router-dom";
import apiClient from "../api/client";
import { useAuth } from "../auth/AuthContext";
import { ErrorBanner } from "../components/ui";

const CartCard = ({ laptop }) => {
    const [quantity, setQuantity] = useState(1);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);
    const { userID, isAuthenticated } = useAuth();
    const navigate = useNavigate();

    const formatPrice = (price) => {
        return new Intl.NumberFormat('en-US', {
            style: 'decimal',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0
        }).format(price);
    };

    const handleQuantityChange = (delta) => {
        const newQuantity = quantity + delta;
        if (newQuantity >= 1) {
            setQuantity(newQuantity);
        }
    };

    const totalPrice = laptop.price * quantity;

    const handleAddToCart = async () => {
        if (!isAuthenticated) {
            navigate('/login');
            return;
        }

        setIsLoading(true);
        setError('');

        const cartData = {
            userID: Number(userID),
            laptopID: Number(laptop.id),
            quantity: quantity,
            totalPrice: totalPrice,
        };

        try {
            await apiClient.post("/cart/create", cartData);
            setSuccess(true);
            setTimeout(() => {
                navigate('/cart');
            }, 1500);
        } catch (error) {
            setError("Failed to add item to cart. Please try again.");
        } finally {
            setIsLoading(false);
        }
    };

    if (success) {
        return (
            <Card className="add-to-cart-card success-state">
                <div className="success-content">
                    <IoCheckmarkCircle size={64} className="success-icon" />
                    <h3>Added to Cart!</h3>
                    <p>Redirecting to your cart...</p>
                </div>
            </Card>
        );
    }

    return (
        <Card className="add-to-cart-card">
            {error && (
                <ErrorBanner 
                    message={error} 
                    onDismiss={() => setError('')} 
                />
            )}

            <Row className="g-0">
                <Col md={5}>
                    <div className="product-image-container">
                        <img 
                            src={laptop.image} 
                            alt={laptop.model}
                            className="product-image"
                        />
                    </div>
                </Col>
                <Col md={7}>
                    <div className="product-details">
                        <h2 className="product-name">{laptop.model}</h2>
                        
                        <div className="product-price-unit">
                            <span className="price-label">Price per unit</span>
                            <span className="price-value">{formatPrice(laptop.price)} LKR</span>
                        </div>

                        <div className="quantity-section">
                            <span className="quantity-label">Quantity</span>
                            <div className="quantity-controls-large">
                                <button 
                                    className="qty-btn-large"
                                    onClick={() => handleQuantityChange(-1)}
                                    disabled={quantity <= 1}
                                >
                                    <FaCircleMinus />
                                </button>
                                <span className="qty-display">{quantity}</span>
                                <button 
                                    className="qty-btn-large"
                                    onClick={() => handleQuantityChange(1)}
                                >
                                    <FaCirclePlus />
                                </button>
                            </div>
                        </div>

                        <div className="total-section">
                            <span className="total-label">Total</span>
                            <span className="total-value">{formatPrice(totalPrice)} LKR</span>
                        </div>

                        <div className="actions-section">
                            <Button 
                                variant="primary" 
                                size="lg"
                                className="add-to-cart-btn"
                                onClick={handleAddToCart}
                                disabled={isLoading}
                            >
                                {isLoading ? (
                                    <>
                                        <span className="loading-spinner loading-spinner-sm"></span>
                                        <span>Adding...</span>
                                    </>
                                ) : (
                                    <>
                                        <IoCartOutline size={20} />
                                        <span>Add to Cart</span>
                                    </>
                                )}
                            </Button>
                            <Button 
                                variant="outline-secondary"
                                onClick={() => navigate(-1)}
                            >
                                Continue Shopping
                            </Button>
                        </div>
                    </div>
                </Col>
            </Row>
        </Card>
    );
}

export default CartCard;