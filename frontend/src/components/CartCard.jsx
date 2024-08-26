import React from "react";
import './css/CartCard.css';
import { Card, Col, Row, FormControl, Alert } from "react-bootstrap";
import { MdDelete } from "react-icons/md";
import { useState } from "react";
import { FaCircleMinus, FaCirclePlus } from "react-icons/fa6";


const CartCard = ({ id, image, price, description }) => {
    const [quantity, setQuantity] = useState(1);
    const [showAlert, setShowAlert] = useState(false);

    const AddQuantity = () => {
        setQuantity(quantity + 1);
        setShowAlert(false);
    }

    const DecreaseQuantity = () => {
        if(quantity > 1){
            setQuantity(quantity - 1);
        }
        else{
            setShowAlert(true);
        }
    }

    const deleteCartItem = () => {
        console.log(`Deleting item with id: ${id}`);
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
                    <MdDelete className="delete-icon" onClick={deleteCartItem}/>
                    <div className="quantity-controls">
                        <FaCircleMinus className="minus-icon" onClick={DecreaseQuantity}/>
                            <FormControl
                            type="text"
                            className="form-control-cart"
                            value={quantity}
                            readOnly
                            />
                        <FaCirclePlus className="plus-icon" onClick={AddQuantity}/>
                    </div>
                </Col>
            </Row>
            {showAlert && (
                    <Alert className="alert-box" variant="warning" onClose={() => setShowAlert(false)} dismissible>
                        Quantity at minimum !!!
                    </Alert>
            )}
        </Card>
    </div>
    );
}

export default CartCard;