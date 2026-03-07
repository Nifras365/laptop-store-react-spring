import React, { useState } from "react";
import './css/LaptopCard.css';
import { Card, Modal, Button, Row, Col } from "react-bootstrap";
import { BsInfoCircle, BsCartPlus, BsCheckCircle, BsXCircle } from "react-icons/bs";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../auth/AuthContext";

const LaptopCard = ({ laptop }) => {
    const [showModal, setShowModal] = useState(false);
    const [imageLoaded, setImageLoaded] = useState(false);
    const navigate = useNavigate();
    const { isAuthenticated } = useAuth();

    const handleShowModal = () => setShowModal(true);
    const handleCloseModal = () => setShowModal(false);

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
                model: laptop.model 
            } 
        });
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
                </div>

                <Card.Body className="d-flex flex-column">
                    <div className="card-brand">{laptop.brand}</div>
                    <Card.Title className="card-model">{laptop.model}</Card.Title>
                    
                    <div className="card-specs">
                        {laptop.processor && (
                            <span className="spec-tag">{laptop.processor}</span>
                        )}
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

            <Modal show={showModal} onHide={handleCloseModal} centered size="lg" className="product-modal">
                <Modal.Header closeButton>
                    <Modal.Title className="modal-title-custom">
                        <span className="modal-brand">{laptop.brand}</span>
                        {laptop.model}
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Row>
                        <Col md={6}>
                            <div className="modal-image-container">
                                <img 
                                    src={laptop.image} 
                                    alt={laptop.model} 
                                    className="img-fluid modal-image" 
                                />
                            </div>
                        </Col>
                        <Col md={6}>
                            <div className="modal-price-section">
                                <span className="modal-price">{formatPrice(laptop.price)}</span>
                                <span className="modal-currency">LKR</span>
                            </div>
                            
                            <div className={`stock-badge ${isInStock ? 'in-stock' : 'out-of-stock'}`}>
                                {isInStock ? (
                                    <>
                                        <BsCheckCircle />
                                        <span>In Stock ({laptop.stockQuantity} units)</span>
                                    </>
                                ) : (
                                    <>
                                        <BsXCircle />
                                        <span>Out of Stock</span>
                                    </>
                                )}
                            </div>

                            <hr className="modal-divider" />

                            <div className="details-list">
                                <div className="detail-item">
                                    <span className="detail-label">Brand</span>
                                    <span className="detail-value">{laptop.brand}</span>
                                </div>
                                <div className="detail-item">
                                    <span className="detail-label">Model</span>
                                    <span className="detail-value">{laptop.model}</span>
                                </div>
                                {laptop.processor && (
                                    <div className="detail-item">
                                        <span className="detail-label">Processor</span>
                                        <span className="detail-value">{laptop.processor}</span>
                                    </div>
                                )}
                                {laptop.specifications && (
                                    <div className="detail-item">
                                        <span className="detail-label">Specifications</span>
                                        <span className="detail-value">{laptop.specifications}</span>
                                    </div>
                                )}
                            </div>
                        </Col>
                    </Row>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="outline-secondary" onClick={handleCloseModal}>
                        Close
                    </Button>
                    <Button 
                        variant="primary" 
                        onClick={handleAddToCart}
                        disabled={!isInStock}
                    >
                        <BsCartPlus className="me-2" />
                        {isInStock ? 'Add to Cart' : 'Out of Stock'}
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    );
}

export default LaptopCard;