import React from "react";
import { Card, Col, Row, FormControl } from "react-bootstrap";
import { MdDelete } from "react-icons/md";
import { FaCircleMinus, FaCirclePlus } from "react-icons/fa6";

const FetchedCartCard = ({ laptop, totalPrice, quantity, deleteCartItem }) => {

    return (
        <div>
            <Card className="cart-card">
                <Row>
                    <Col md={4}>
                        <Card.Img src={laptop?.image} className="cart-card-img" />
                    </Col>
                    <Col md={6}>
                        <Card.Body>
                            <Card.Title>Price: {laptop?.price} LKR</Card.Title>
                            <Card.Text>{laptop?.model}</Card.Text>
                            <Card.Text>Total Price: {totalPrice} LKR</Card.Text>
                        </Card.Body>
                    </Col>
                    <Col>
                        <MdDelete className="delete-icon" onClick={deleteCartItem} />
                        <div className="quantity-controls">
                            <FaCircleMinus className="minus-icon" />
                            <FormControl
                                type="text"
                                className="form-control-cart"
                                value={quantity}
                                readOnly
                            />
                            <FaCirclePlus className="plus-icon" />
                        </div>
                    </Col>
                </Row>
            </Card>
        </div>
    );
};

export default FetchedCartCard;
