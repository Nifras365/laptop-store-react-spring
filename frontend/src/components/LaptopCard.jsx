import React from "react";
import './LaptopCard.css';
import { Card, Button, Row, Col } from "react-bootstrap";
import { IoCart } from "react-icons/io5";

const LaptopCard = ({ image, price, description }) => {
    return (
        <Card className="laptop-card">
            <Card.Img variant="top" src={image} className="laptop-card-img" />
            <Card.Body>
                <Card.Title>Price: ${price}</Card.Title>
                <Card.Text>
                    {description}
                </Card.Text>
                <Row>
                    <Col>
                    <IoCart size={35}/>
                    </Col>
                    <Col>
                        <Button variant="primary" className="buy-now-btn">Buy Now</Button>
                    </Col>
                </Row>
            </Card.Body>
        </Card>
    );
}

export default LaptopCard;
