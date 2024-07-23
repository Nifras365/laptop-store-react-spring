import React from "react";
import './CartCard.css';
import { Card, Col, Row } from "react-bootstrap";

const CartCard = ({ image, price, description }) => {
    return(
    <div>
        <Card className="cart-card">
            <Row>
                <Col md={4}>
                    <Card.Img src={image} className="cart-card-img"/>
                </Col>
                <Col md={6}>
                <Card.Body>
                    <Card.Title>Price: ${price}</Card.Title>
                    <Card.Text>{description}</Card.Text>
                </Card.Body>
                </Col>
            </Row>
        </Card>
    </div>
    );
}

export default CartCard;