import React from "react";
import '../pagescss/Orders.css';
import { useLocation } from "react-router-dom";

const Orders = () => {
    const location = useLocation();
    const { orderDetails } = location.state || {};

    return (
        <div>
            <h1>Your Orders</h1>
                {orderDetails && orderDetails.length > 0 ? (
                    orderDetails.map((order, index) => (
                        <div key={index} className="order-card">
                            <h2>Order Details</h2>
                            <p><strong>ID:</strong> {order.id}</p>
                            <p><strong>Price:</strong> ${order.price}</p>
                            <p><strong>Description:</strong> {order.description}</p>
                            <img src={order.image} alt={order.description} className="order-image" />
                        </div>
                    ))
                ) : (
                    <p>No orders placed.</p>
                )}
        </div>
    );
};

export default Orders;
