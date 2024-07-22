import React from "react";
import './LaptopCard.css';
import { Card, Button, Row, Col } from "react-bootstrap";

const LaptopCard = ({ image, price, description }) => {
    return (
        <Card className="laptop-card">
            <Card.Img variant="top" src={image} className="laptop-card-img" />
            <Card.Body>
                <Card.Title>${price}</Card.Title>
                <Card.Text>
                    {description}
                </Card.Text>
                <Row>
                    <Col>
                        <Button variant="primary" className="add-to-cart-btn">Add to Cart</Button>
                    </Col>
                    <Col>
                        <Button variant="success" className="buy-now-btn">Buy Now</Button>
                    </Col>
                </Row>
            </Card.Body>
        </Card>
    );
}

export default LaptopCard;
