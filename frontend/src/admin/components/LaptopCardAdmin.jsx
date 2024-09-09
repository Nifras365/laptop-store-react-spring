import React from "react";
import '../css/LaptopCardAdmin.css';
import { Card, Row, Col } from "react-bootstrap";
import { FaEdit } from "react-icons/fa";

const LaptopCardAdmin = ({ laptop, onEdit, onDelete }) => {

    const handleEditClick = () => {
        onEdit(laptop.id);
    };

    const handleDeleteClick = () => {
        onDelete(laptop.id);
    };

    return (
        <Card className="laptop-card">
            <Card.Img variant="top" src={laptop.image} className="laptop-card-img" />
            <Card.Body>
                <Card.Title>Price: {laptop.price} LKR</Card.Title>
                <Card.Text>{laptop.model}</Card.Text>
                <Row>
                    <Col>
                        <FaEdit className="iocart" onClick={handleEditClick} />
                    </Col>
                    <Col>
                        <button className="buy-now-btn" onClick={handleDeleteClick}>
                            Delete
                        </button>
                    </Col>
                </Row>
            </Card.Body>
        </Card>
    );
};

export default LaptopCardAdmin;
