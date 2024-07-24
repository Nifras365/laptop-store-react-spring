import React from "react";
import './CartCard.css';
import { Alert, Card, Col, Row, FormControl } from "react-bootstrap";
import { MdDelete } from "react-icons/md";
import { useState } from "react";
import { FaCircleMinus, FaCirclePlus } from "react-icons/fa6";


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
                </Card.Body>
                </Col>
                <Col>
                    <MdDelete className="delete-icon"/>
                    <div className="quantity-controls">
                        <FaCircleMinus className="minus-icon" onClick={DecreaseQuantity}>-</FaCircleMinus>
                            <FormControl
                            type="text"
                            className="form-control"
                            value={quantity}
                            readOnly
                            />
                        <FaCirclePlus className="plus-icon" onClick={AddQuantity}>+</FaCirclePlus>
                    </div>
                </Col>
            </Row>
        </Card>
    </div>
    );
}

export default CartCard;