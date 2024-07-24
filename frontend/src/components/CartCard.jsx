import React from "react";
import './CartCard.css';
import { Alert, Card, Col, Row, Button, FormControl } from "react-bootstrap";
import { MdDelete } from "react-icons/md";
import { useState } from "react";

const CartCard = ({ image, price, description }) => {
    const [quantity, setQuantity] = useState(1);

    const AddQuantity = () => {
        setQuantity(quantity + 1);
    }

    const DecreaseQuantity = () => {
        if(quantity > 1){
            setQuantity(quantity - 1);
        }
        else{
            Alert("Quantity at minimum !!!");
        }
    }

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
                    <div>
                        <Button>-</Button>
                            <FormControl/>
                        <Button>+</Button>
                    </div>
                </Card.Body>
                </Col>
                <Col>
                    <MdDelete className="delete-icon"/>
                </Col>
            </Row>
        </Card>
    </div>
    );
}

export default CartCard;