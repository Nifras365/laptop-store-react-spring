import React, { useState, useEffect } from "react";
import {  useNavigate } from "react-router-dom";
import { IoArrowBack } from "react-icons/io5";
import axios from "axios";
import FetchedCartCard from "../components/FetchedCartCard";

const Cart = () => {
    const navigate = useNavigate();
    const [cartItems, setCartItems] = useState([]);
    const [laptopDetails, setLaptopDetails] = useState({});

    const goBack = () => {
        window.history.back();
    };

    const placeOrder = () => {
        console.log("Order placed!");
        navigate('/orders');
    };

    const deleteCartItem = async (cartID) => {
        try {
            const response = await axios.delete(`http://localhost:8080/cart/delete/${cartID}`);
            console.log(`Item with cartID ${cartID} deleted successfully:`, response.data);
            setCartItems(cartItems.filter(item => item.cartID !== cartID)); 
        } catch (error) {
            console.error("Error deleting cart item:", error);
        }
    };

    useEffect(() => {
        async function fetchCarts() {
            try {
                const response = await axios.get('http://localhost:8080/cart/get-all');
                setCartItems(response.data.data);
                console.log("Fetched carts:", response.data.data);
            } catch (error) {
                console.error("Error fetching cart data: ", error);
            }
        }

        fetchCarts();
    }, []);

    useEffect(() => {
        async function fetchLaptopDetails(cartItems) {
            const laptops = {};
            for (const item of cartItems) {
                try {
                    const response = await axios.get(`http://localhost:8080/laptops/${item.laptopID}`);
                    laptops[item.laptopID] = response.data;
                } catch (error) {
                    console.error("Error fetching laptop data: ", error);
                }
            }
            setLaptopDetails(laptops);
        }
    
        if (cartItems.length > 0) {
            fetchLaptopDetails(cartItems);
        }
    }, [cartItems]);

    return (
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
                        cursor: 'pointer',
                    }}
                />
            </div>
            <h1>Your Cart</h1>
            {cartItems.length > 0 ? (
                <div>
                    {cartItems.map((cartItem) => (
                        <FetchedCartCard
                            key={cartItem.cartID}
                            laptop={laptopDetails[cartItem.laptopID]}
                            totalPrice={cartItem.totalPrice}
                            quantity={cartItem.quantity}
                            deleteCartItem={() => deleteCartItem(cartItem.cartID)} 
                        />
                    ))}
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
                                transition: 'background-color 0.3s ease',
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

export default Cart;
