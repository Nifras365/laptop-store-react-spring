import React from "react";
import './css/LaptopCard.css';
import { Card, Row, Col } from "react-bootstrap";
import { IoCart } from "react-icons/io5";
import { useNavigate } from "react-router-dom";

const LaptopCard = ({laptop}) => {

    const navigate = useNavigate();

    const HandleAddToCart = () => {
        navigate('/cart', { state: { id: laptop.id, image: laptop.image, price: laptop.price, model: laptop.model } });
    }

    return (
        <Card className="laptop-card">
            <Card.Img variant="top" src={laptop.image} className="laptop-card-img" />
            <Card.Body>
                <Card.Title>Price: {laptop.price} LKR</Card.Title>
                <Card.Text>
                    {laptop.model}
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
