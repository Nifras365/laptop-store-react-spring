import React from "react";
import CartCard from "../components/CartCard";
import { useLocation, useNavigate } from "react-router-dom";
import { IoArrowBack } from "react-icons/io5";

const Cart = () => {
    const location =  useLocation();
    const{id, image, price, model} = location.state || {};
    const navigate = useNavigate();

    const goBack = () => {
        window.history.back();
    }

    const placeOrder = () => {
        const orderDetails = { id, image, price, model };

        navigate("/orders", { state: { orderDetails } });
        console.log(orderDetails);
    }

    return(
        <div>
            <div>
                <IoArrowBack
                        size={25}
                        onClick={goBack}
                        style={{
                                    position: 'absolute',
                                    top: '20px',
                                    left: '20px',
                                    zIndex: 1000,
                                    border: 'none',
                                    background: 'none',
                                    cursor: 'pointer'
                                }}
                />
            </div>
            <h1>Your Cart</h1>
                {id ? (
                    <div>
                        <CartCard laptop={{ id, image, price, model }} />
                        <button style={{
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
                ) : (
                    <h1>No Items</h1>
                )    
                }
        </div>
    );
}

export default Cart;