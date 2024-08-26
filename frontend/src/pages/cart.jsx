import React from "react";
import CartCard from "../components/CartCard";
import { useLocation } from "react-router-dom";
import { IoArrowBack } from "react-icons/io5";

const Cart = () => {
    const location =  useLocation();
    const{id, image, price, description} = location.state || {};

    const goBack = () => {
        window.history.back();
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
                                background: 'none'
                                }}
                />
            </div>
            <h1>Your Cart</h1>
            {id ? (
                 <CartCard id={id} image={image} price={price} description={description}/>
            ) : (
                 <h1>No Items</h1>
            )    
            }
        </div>
    );
}

export default Cart;