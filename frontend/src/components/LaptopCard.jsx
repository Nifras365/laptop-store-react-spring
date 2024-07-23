import React from "react";
import './LaptopCard.css';
import { Card, Row, Col } from "react-bootstrap";
import { IoCart } from "react-icons/io5";
import { useNavigate } from "react-router-dom";

const LaptopCard = ({id, image, price, description }) => {

    const navigate = useNavigate();

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
                    <IoCart className="iocart" onClick={()=>navigate('/cart')}/>
                    </Col>
                    <Col>
                        <button className="buy-now-btn">Buy Now</button>
                    </Col>
                </Row>
            </Card.Body>
        </Card>
    );
}

export default LaptopCard;
