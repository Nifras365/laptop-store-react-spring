import React from "react";
import './CartCard.css';
import { Card } from "react-bootstrap";

const CartCard = ({ image, price, description }) => {
    return(
    <div>
        <Card className="cart-card">
            <Card.Img src={image} className="cart-card-img"/>
            <Card.Body>
                <Card.Title>Price: ${price}</Card.Title>
                <Card.Text>{description}</Card.Text>
            </Card.Body>
        </Card>
    </div>
    );
}

export default CartCard;