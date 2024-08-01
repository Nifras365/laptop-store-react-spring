import React from "react";
import './css/Dashboard.css';
import SideBar from "./components/SideBar.jsx";

const Dashboard = () => {
    return(
        <div>
            Admin Features .....
            <SideBar/>
        <div>
            <button>Add Laptop</button>
            <button>See Users</button>
            <button>See Laptops</button>
        </div>
        </div>
    )
}

export default Dashboard;