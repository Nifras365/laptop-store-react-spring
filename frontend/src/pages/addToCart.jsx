import CartCard from "../components/CartCard";
import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";

const AddToCart = () => {
    const location =  useLocation();
    const { id, image, price, model } = location.state || {};
    const navigate = useNavigate();

    const placeOrder = () => {
        const orderDetails = { id, image, price, model };
        navigate("/orders", { state: { orderDetails } });
        console.log(orderDetails);
        console.log("orderDetails");
    };

    return (
            <div>
            <h1>Your Cart</h1>
            {id ? (
                <div>
                <CartCard laptop={{ id, image, price, model }} />
                    <div>
                        <button
                            style={{
                                position: 'fixed',
                                bottom: '20px',
                                right: '20px',
                                backgroundColor: '#28a745',
                                color: 'white',
                                border: 'none',
                                padding: '10px 20px',
                                borderRadius: '5px',
                                fontSize: '16px',
                                cursor: 'pointer',
                                boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
                                transition: 'background-color 0.3s ease'
                            }}
                            onClick={placeOrder}
                            onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#218838'}
                            onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#28a745'}
                        >
                            Place Order
                        </button>
                    </div>
                </div>
            ) : (
                <h1>No Items</h1>
            )}
        </div>
    );
};

export default AddToCart;