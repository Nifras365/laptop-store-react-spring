import React, { useState } from "react";
import './css/LaptopCard.css';
import { Card, Row, Col, Modal, Button } from "react-bootstrap";
import { MdOutlineGridView } from "react-icons/md";
import { useNavigate } from "react-router-dom";

const LaptopCard = ({ laptop }) => {
    const [showModal, setShowModal] = useState(false);

    const handleShowModal = () => setShowModal(true);
    const handleCloseModal = () => setShowModal(false);

    const navigate = useNavigate();

    const viewInCart = () => {
        navigate('/addToCart', { state: { id: laptop.id, image: laptop.image, price: laptop.price, model: laptop.model } });
    };

    return (
        <>
            <Card className="laptop-card">
                <Card.Img variant="top" src={laptop.image} className="laptop-card-img" />
                <Card.Body>
                    <Card.Title>Price: {laptop.price} LKR</Card.Title>
                    <Card.Text>
                        {laptop.model}
                    </Card.Text>
                    <Row>
                        <Col>
                            <MdOutlineGridView className="iocart" onClick={handleShowModal} />
                        </Col>
                        <Col>
                            <button className="buy-now-btn">Buy Now</button>
                        </Col>
                    </Row>
                </Card.Body>
            </Card>
            <Modal show={showModal} onHide={handleCloseModal} centered>
                <Modal.Header closeButton>
                    <Modal.Title>{laptop.model} Details</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <img src={laptop.image} alt={laptop.model} style={{ width: '100%', marginBottom: '10px' }} />
                    <p><strong>Brand:</strong> {laptop.brand}</p>
                    <p><strong>Model:</strong> {laptop.model}</p>
                    <p><strong>Price:</strong> {laptop.price} LKR</p>
                    <p><strong>Specifications:</strong> {laptop.specifications}</p>
                    <p><strong>Stock Quantity:</strong> {laptop.stockQuantity}</p>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={viewInCart} style={{width: '170px'}}>
                        View in Cart
                    </Button>
                    <Button variant="secondary" onClick={handleCloseModal}>
                        Close
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    );
}

export default LaptopCard;
