import React from "react";
import CartCard from "../components/CartCard";
import { useLocation } from "react-router-dom";

const Cart = () => {
    const location =  useLocation();
    const{id, image, price, description} = location.state || {};

    return(
        <div>
            <h1>Your Cart</h1>
            {image ? (
                 <CartCard id={id} image={image} price={price} description={description}/>
            ) : (
                 <h1>No Items</h1>
            )    
            }
        </div>
    );
}

export default Cart;