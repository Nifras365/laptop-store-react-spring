import React from "react";
import './css/CartCard.css';
import { Card, Col, Row, FormControl, Button } from "react-bootstrap";
import { MdDelete } from "react-icons/md";
import { FaCircleMinus, FaCirclePlus } from "react-icons/fa6";

const FetchedCartCard = ({ laptop, totalPrice, quantity }) => {

    const AddQuantity = () => {
        console.log("+");
    };

    const DecreaseQuantity = () => {
        console.log("-");
    };

    const deleteCartItem = () => {
        console.log(`Deleting item with id: ${laptop.id}`);
    };

    return (
        <div>
            <Card className="cart-card">
                <Row>
                    <Col md={4}>
                        <Card.Img src={laptop?.image} className="cart-card-img" alt="Laptop Image"/>
                    </Col>
                    <Col md={6}>
                        <Card.Body>
                            <Card.Title>Price: {laptop?.price} LKR</Card.Title>
                            <Card.Text>{laptop?.model}</Card.Text>
                            <Card.Text>Total Price: {totalPrice} LKR</Card.Text>
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
            </Card>
        </div>
    );
};

export default FetchedCartCard;
