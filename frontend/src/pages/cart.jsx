import React from "react";
import CartCard from "../components/CartCard";
import { useLocation } from "react-router-dom";

const Cart = () => {
    const location =  useLocation();
    const{id, image, price, description} = location.state;

    return(
        <div>
            <h1>Under Construction</h1>
            <h2>Some laptop should be added here this is a cart...</h2>
            <CartCard id={id} image={image} price={price} description={description}/>
        </div>
    );
}

export default Cart;