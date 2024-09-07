import React from "react";
import './css/LaptopCard.css';
import { Card, Row, Col } from "react-bootstrap";
import { IoCart } from "react-icons/io5";
import { useNavigate } from "react-router-dom";

const LaptopCard = ({id, image, price, model }) => {

    const navigate = useNavigate();

    const HandleAddToCart = () => {
        navigate('/cart');
    }

    return (
        <Card className="laptop-card">
            <Card.Img variant="top" src={image} className="laptop-card-img" />
            <Card.Body>
                <Card.Title>Price: ${price}</Card.Title>
                <Card.Text>
                    {model}
                </Card.Text>
                <Row>
                    <Col>
                    <IoCart className="iocart" onClick={HandleAddToCart}/>
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
