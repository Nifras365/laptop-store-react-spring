import React, { useState, useEffect, useRef } from "react";
import {  useNavigate } from "react-router-dom";
import { IoArrowBack } from "react-icons/io5";
import apiClient from "../api/client";
import FetchedCartCard from "../components/FetchedCartCard";
import { useAuth } from "../auth/AuthContext";

const Cart = () => {
    const navigate = useNavigate();
    const [cartItems, setCartItems] = useState([]);
    const [laptopDetails, setLaptopDetails] = useState({});
    const { userID } = useAuth();
    // Cache for laptop details to avoid refetching
    const laptopCache = useRef({});

    const goBack = () => {
        window.history.back();
    };

    const ProceedToCheckout = async() => {
        try {
         //to calculate the final price
         const finalPrice = cartItems.reduce((sum, item) => sum + item.totalPrice, 0);

         const orderDTO = {
            userID: parseInt(userID),
            finalPrice: finalPrice,
            orderItemDTOS: cartItems.map(item => ({
                laptopID: item.laptopID,
                quantity: item.quantity,
                totalPrice: item.totalPrice
            }))
         };

         console.log("OrderDTO to be sent: ", orderDTO);

         const response = await apiClient.post('/orders/create', orderDTO);

         console.log("Order Placed !!!", response.data);

        if (response.status >= 200 && response.status < 300) {

                await apiClient.delete(`/cart/user/${userID}`);

                setCartItems([]);
                
                navigate('/orders');
            } else {
                 throw new Error("Failed to create the order.");
            }

         setCartItems([]);

         navigate('/orders');
            
        } catch (error) {
            console.error("Error in placing order: ",error);
        }

    };

    const deleteCartItem = async (cartID) => {
        try {
            const response = await apiClient.delete(`/cart/delete/${cartID}`);
            console.log(`Item with cartID ${cartID} deleted successfully:`, response.data);
            setCartItems(cartItems.filter(item => item.cartID !== cartID)); 
        } catch (error) {
            console.error("Error deleting cart item:", error);
        }
    };

    useEffect(() => {
        async function fetchCarts() {
            try {
                const response = await apiClient.get(`/cart/user/${userID}`);
                setCartItems(response.data.data);
                console.log("Fetched carts:", response.data.data);
            } catch (error) {
                console.error("Error fetching cart data: ", error);
            }
        }

        if (userID) {
            fetchCarts();
        }
    }, [userID]);

    useEffect(() => {
        async function fetchLaptopDetails(cartItems) {
            // Get unique laptop IDs that aren't already cached
            const uniqueIds = [...new Set(cartItems.map(item => item.laptopID))];
            const idsToFetch = uniqueIds.filter(id => !laptopCache.current[id]);

            // Fetch all needed laptops in parallel
            if (idsToFetch.length > 0) {
                const fetchPromises = idsToFetch.map(id => 
                    apiClient.get(`/laptops/${id}`)
                        .then(response => ({ id, data: response.data }))
                        .catch(error => {
                            console.error(`Error fetching laptop ${id}:`, error);
                            return { id, data: null };
                        })
                );

                const results = await Promise.all(fetchPromises);
                
                // Update cache with fetched data
                results.forEach(({ id, data }) => {
                    if (data) {
                        laptopCache.current[id] = data;
                    }
                });
            }

            // Build laptopDetails from cache
            const laptops = {};
            uniqueIds.forEach(id => {
                if (laptopCache.current[id]) {
                    laptops[id] = laptopCache.current[id];
                }
            });
            
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
                            onClick={ProceedToCheckout}
                            onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#218838'}
                            onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#28a745'}
                        >
                            Proceed to checkout
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
