import React from "react";
import '../pagescss/Orders.css';
import { useLocation } from "react-router-dom";

const Orders = () => {
    const location = useLocation();
    const{orderDetails} = location.state || {};

    return(
        <div>
            <h1>Your Orders</h1>
        </div>
    );
}

export default Orders;