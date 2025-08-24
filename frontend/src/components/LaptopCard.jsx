import React, { useState } from "react";
import './css/LaptopCard.css';
import { Card, Modal, Button, ButtonGroup, Row, Col } from "react-bootstrap";
import { BsInfoCircle, BsCartPlus } from "react-icons/bs";
import { useNavigate } from "react-router-dom";

const LaptopCard = ({ laptop }) => {
    const [showModal, setShowModal] = useState(false);
    const navigate = useNavigate();

    const handleShowModal = () => setShowModal(true);
    const handleCloseModal = () => setShowModal(false);

    const buyNow = () => {
        navigate('/addToCart', { state: { id: laptop.id, image: laptop.image, price: laptop.price, model: laptop.model } });
    };

    const addToCart = () => {
        navigate('/addToCart', { state: { id: laptop.id, image: laptop.image, price: laptop.price, model: laptop.model } });
    };

    return (
        <>
            <Card className="laptop-card h-100">
                <div className="laptop-card-img-container">
                    <Card.Img variant="top" src={laptop.image} className="laptop-card-img" />
                </div>
                <Card.Body className="d-flex flex-column">
                    <Card.Title className="card-model">{laptop.model}</Card.Title>
                    <Card.Text className="card-price">
                        {laptop.price} LKR
                    </Card.Text>
                    <ButtonGroup className="mt-auto card-actions">
                        <Button variant="outline-secondary" onClick={handleShowModal}>
                            <BsInfoCircle className="me-2" /> Details
                        </Button>
                        <Button variant="primary" onClick={buyNow}>
                            <BsCartPlus className="me-2" /> Buy Now
                        </Button>
                    </ButtonGroup>
                </Card.Body>
            </Card>

            <Modal show={showModal} onHide={handleCloseModal} centered size="lg">
                <Modal.Header closeButton>
                    <Modal.Title className="modal-title-custom">{laptop.model}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Row>
                        <Col md={6}>
                            <img src={laptop.image} alt={laptop.model} className="img-fluid modal-image" />
                        </Col>
                        <Col md={6}>
                            <h3 className="modal-price-details">{laptop.price} LKR</h3>
                            <p className={laptop.stockQuantity > 0 ? 'stock-status in-stock' : 'stock-status out-of-stock'}>
                                {laptop.stockQuantity > 0 ? `In Stock (${laptop.stockQuantity} units)` : 'Out of Stock'}
                            </p>
                            <hr />
                            <div className="details-list">
                                <div className="detail-item">
                                    <span className="detail-label">Brand</span>
                                    <span className="detail-value">{laptop.brand}</span>
                                </div>
                                <div className="detail-item">
                                    <span className="detail-label">Model</span>
                                    <span className="detail-value">{laptop.model}</span>
                                </div>
                                <div className="detail-item">
                                    <span className="detail-label">Specs</span>
                                    <span className="detail-value">{laptop.specifications}</span>
                                </div>
                            </div>
                        </Col>
                    </Row>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleCloseModal}>
                        Close
                    </Button>
                    <Button variant="primary" onClick={addToCart}>
                        <BsCartPlus className="me-2" /> Add to Cart
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    );
}

export default LaptopCard;