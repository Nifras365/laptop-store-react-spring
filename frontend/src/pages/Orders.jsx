import React, { useEffect, useState } from "react";
import axios from "axios";
import "../pagescss/Orders.css";

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

useEffect(() => {
  async function fetchOrders() {
    try {
      const token = localStorage.getItem("token");
      const userID = localStorage.getItem("userID");

      console.log("Sending Token:", token);

      const response = await axios.get(`http://localhost:8080/orders/user/${userID}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setOrders(response.data.data); 
    } catch (error) {
      console.error("Error fetching orders:", error);
    } finally {
      setLoading(false);
    }
  }

  fetchOrders();
}, []);

  if (loading) {
    return <p>Loading your orders...</p>;
  }

  return (
    <div>
      <h1>Your Orders</h1>
      {orders && orders.length > 0 ? (
        orders.map((order) => (
          <div key={order.orderId} className="order-card">
            <h2>Order #{order.orderId}</h2>
            <p>
              <strong>User ID:</strong> {order.userID}
            </p>
            <p>
              <strong>Final Price:</strong> Rs. {order.finalPrice.toLocaleString()}
            </p>

            <h3>Items:</h3>
            <ul>
              {order.orderItemDTOS.map((item, index) => (
                <li key={index}>
                  Laptop ID: {item.laptopID} | Qty: {item.quantity} | Price: Rs.{" "}
                  {item.totalPrice.toLocaleString()}
                </li>
              ))}
            </ul>
          </div>
        ))
      ) : (
        <p>No orders placed.</p>
      )}
    </div>
  );
};

export default Orders;
