import React from "react";
import './css/CartCard.css';
import { Card, Col, Row, FormControl, Alert, Button } from "react-bootstrap";
import { useState } from "react";
import { FaCircleMinus, FaCirclePlus } from "react-icons/fa6";
import axios from "axios";


const CartCard = ({ laptop }) => {
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
    
    const totalPrice = (laptop.price * quantity).toFixed();

    const handleAddToCart = async (e) => {
        e.preventDefault();

        const userID = localStorage.getItem('userID');
        const token = localStorage.getItem('token');

        console.log('token:', token);

        if(!userID){
            alert("User not logged in !!!");
            return;
        }
    
        const cartData = {
            userID: Number(userID),
            laptopID: Number(laptop.id),
            quantity: parseInt(quantity, 10),
            totalPrice: Number(totalPrice),
        }

        console.log("cartData types:", {
            userID: typeof cartData.userID,
            laptopID: typeof cartData.laptopID,
            quantity: typeof cartData.quantity,
            totalPrice: typeof cartData.totalPrice
        });
    
        try {
            const response = await axios.post("http://localhost:8080/cart/create", cartData, {
                headers:{
                    'Content-Type': 'application/json'
                }
            });
            console.log("Cart data posted successfully:", response);
            alert("Item added to cart successfully!");
        } catch (error) {
            console.error("Error posting cart data:", error);
            alert("Failed to add item to cart.");
        }
    };
    

    return(
    <div>
        <Card className="cart-card">
            <Row>
                <Col md={4}>
                    <Card.Img src={laptop.image} className="cart-card-img"/>
                </Col>
                <Col md={6}>
                <Card.Body>
                    <Card.Title>Price: {laptop.price} LKR</Card.Title>
                    <Card.Text>{laptop.model}</Card.Text>
                    <Card.Text>Total Price: {totalPrice} LKR</Card.Text>
                </Card.Body>
                </Col>
                <Col>
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
                        <div className="text-center mt-3">
                <Button 
                    variant="success" 
                    onClick={handleAddToCart} 
                    style={{ width: "150px" }}>
                    Add to Cart
                </Button>
            </div>
        </Card>
    </div>
    );
}

export default CartCard;