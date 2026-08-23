import React, { useState } from "react";
import './css/LaptopCard.css';
import { Card, Modal, Button, Row, Col } from "react-bootstrap";
import { BsInfoCircle, BsCartPlus, BsCheckCircle, BsXCircle, BsHeart, BsHeartFill } from "react-icons/bs";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../auth/AuthContext";
import { useToast } from "../contexts/ToastContext";
import apiClient from "../api/client";

const LaptopCard = ({ laptop, isInWishlist: initialWishlistState = false }) => {
    const [imageLoaded, setImageLoaded] = useState(false);
    const [inWishlist, setInWishlist] = useState(initialWishlistState);
    const navigate = useNavigate();
    const { isAuthenticated, userID } = useAuth();
    const { addToast } = useToast();

    // Sync state if prop changes
    React.useEffect(() => {
        setInWishlist(initialWishlistState);
    }, [initialWishlistState]);

    const handleShowModal = () => navigate(`/laptop/${laptop.id}`);

    const isInStock = laptop.stockQuantity > 0;

    const handleAddToCart = () => {
        if (!isAuthenticated) {
            navigate('/login');
            return;
        }
        navigate('/addToCart', { 
            state: { 
                id: laptop.id, 
                image: laptop.image, 
                price: laptop.price, 
                model: laptop.model,
                stockQuantity: laptop.stockQuantity 
            } 
        });
    };

    const handleToggleWishlist = async (e) => {
        e.stopPropagation(); // prevent card click
        if (!isAuthenticated) {
            navigate('/login');
            return;
        }

        try {
            if (inWishlist) {
                await apiClient.delete(`/wishlist/remove/${userID}/${laptop.id}`);
                setInWishlist(false);
                addToast(`${laptop.model} removed from wishlist`, 'info');
            } else {
                await apiClient.post('/wishlist/add', {
                    userId: userID,
                    laptopId: laptop.id
                });
                setInWishlist(true);
                addToast(`${laptop.model} added to wishlist`, 'success');
            }
        } catch (error) {
            addToast('Failed to update wishlist', 'error');
            console.error("Failed to toggle wishlist", error);
        }
    };

    const formatPrice = (price) => {
        return new Intl.NumberFormat('en-US', {
            style: 'decimal',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0
        }).format(price);
    };

    return (
        <>
            <Card className="laptop-card h-100">
                {!isInStock && (
                    <div className="out-of-stock-badge">
                        Out of Stock
                    </div>
                )}

                <div className="laptop-card-img-container">
                    {!imageLoaded && (
                        <div className="image-placeholder">
                            <div className="image-placeholder-shimmer"></div>
                        </div>
                    )}
                    <Card.Img 
                        variant="top" 
                        src={laptop.image} 
                        alt={laptop.model}
                        className={`laptop-card-img ${imageLoaded ? 'loaded' : ''}`}
                        loading="lazy"
                        onLoad={() => setImageLoaded(true)}
                    />
                    <button 
                        className={`wishlist-btn ${inWishlist ? 'active' : ''}`}
                        onClick={handleToggleWishlist}
                        title={inWishlist ? "Remove from wishlist" : "Add to wishlist"}
                    >
                        {inWishlist ? <BsHeartFill /> : <BsHeart />}
                    </button>
                </div>

                <Card.Body className="d-flex flex-column">
                    <div className="card-brand">{laptop.brand}</div>
                    <Card.Title className="card-model">{laptop.model}</Card.Title>
                    
                    <div className="card-specs">
                        {laptop.processor && (
                            <span className="spec-tag">{laptop.processor}</span>
                        )}
                        <span className={`spec-tag stock-tag ${isInStock ? 'in-stock' : 'out-of-stock'}`}>
                            {isInStock ? `${laptop.stockQuantity} in stock` : 'Out of stock'}
                        </span>
                    </div>

                    <div className="card-footer-section mt-auto">
                        <div className="card-price">
                            <span className="price-amount">{formatPrice(laptop.price)}</span>
                            <span className="price-currency">LKR</span>
                        </div>

                        <div className="card-actions">
                            <Button 
                                variant="outline-secondary" 
                                className="btn-details"
                                onClick={handleShowModal}
                            >
                                <BsInfoCircle />
                            </Button>
                            <Button 
                                variant="primary" 
                                className="btn-add-cart"
                                onClick={handleAddToCart}
                                disabled={!isInStock}
                            >
                                <BsCartPlus />
                                <span>{isInStock ? 'Add to Cart' : 'Unavailable'}</span>
                            </Button>
                        </div>
                    </div>
                </Card.Body>
            </Card>
        </>
    );
}

export default LaptopCard;