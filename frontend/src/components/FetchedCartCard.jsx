import React from "react";
import { Card, Col, Row } from "react-bootstrap";
import { MdDelete } from "react-icons/md";
import { FaCircleMinus, FaCirclePlus } from "react-icons/fa6";
import './css/CartCard.css';

const FetchedCartCard = ({ laptop, totalPrice, quantity, onDelete, onQuantityChange }) => {
    const formatPrice = (price) => {
        return new Intl.NumberFormat('en-US', {
            style: 'decimal',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0
        }).format(price);
    };

    if (!laptop) {
        return (
            <Card className="cart-item-card loading">
                <div className="cart-item-skeleton">
                    <div className="skeleton-image"></div>
                    <div className="skeleton-content">
                        <div className="skeleton-text"></div>
                        <div className="skeleton-text short"></div>
                    </div>
                </div>
            </Card>
        );
    }

    return (
        <Card className="cart-item-card">
            <Row className="g-0 align-items-center">
                <Col xs={3} md={2}>
                    <div className="cart-item-img-container">
                        <img 
                            src={laptop.image} 
                            alt={laptop.model}
                            className="cart-item-img"
                        />
                    </div>
                </Col>
                <Col xs={9} md={10}>
                    <div className="cart-item-content">
                        <div className="cart-item-info">
                            <span className="cart-item-brand">{laptop.brand}</span>
                            <h4 className="cart-item-name">{laptop.model}</h4>
                            <span className="cart-item-unit-price">
                                {formatPrice(laptop.price)} LKR each
                            </span>
                        </div>

                        <div className="cart-item-actions">
                            <div className="quantity-controls">
                                <button 
                                    className="qty-btn"
                                    onClick={() => onQuantityChange(quantity - 1)}
                                    disabled={quantity <= 1}
                                >
                                    <FaCircleMinus />
                                </button>
                                <span className="qty-value">{quantity}</span>
                                <button 
                                    className="qty-btn"
                                    onClick={() => onQuantityChange(quantity + 1)}
                                >
                                    <FaCirclePlus />
                                </button>
                            </div>

                            <div className="cart-item-price">
                                <span className="price-label">Total</span>
                                <span className="price-value">{formatPrice(totalPrice)} LKR</span>
                            </div>

                            <button 
                                className="delete-btn"
                                onClick={onDelete}
                                title="Remove item"
                            >
                                <MdDelete />
                            </button>
                        </div>
                    </div>
                </Col>
            </Row>
        </Card>
    );
};

export default FetchedCartCard;
