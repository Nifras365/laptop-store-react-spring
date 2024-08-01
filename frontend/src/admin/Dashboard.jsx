import React from "react";
import './css/Dashboard.css';
import Sidebar from "./components/Sidebar";

const Dashboard = () => {
    return(
        <div>
            Admin Features .....
            <Sidebar/>
        <div>
            <button>Add Laptop</button>
            <button>See Users</button>
            <button>See Laptops</button>
        </div>
        </div>
    )
}

export default Dashboard;