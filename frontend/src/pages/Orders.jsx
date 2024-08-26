import React from "react";
import '../pagescss/Orders.css';
import { useLocation } from "react-router-dom";

const Orders = () => {
    const location = useLocation();
    const{orderDetails} = location.state || {};

    return(
        <div>
            <h1>Your Orders</h1>
            {orderDetails ? (
                <div className="order-card">
                    <h2>Order Details</h2>
                    <p><strong>ID:</strong> {orderDetails.id}</p>
                    <p><strong>Price:</strong> ${orderDetails.price}</p>
                    <p><strong>Description:</strong> {orderDetails.description}</p>
                </div>
            ):(
                <p>No orders placed.</p>
            )
            }
        </div>
    );
}

export default Orders;