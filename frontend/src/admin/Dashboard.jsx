import React from "react";
import './css/Dashboard.css';
import SideBar from "./components/SideBar.jsx";
import { useState } from "react";
import AddLaptops from "./components/AddLaptops.jsx";
import ManageLaptops from "./components/ManageLaptops.jsx";
import ViewUsers from "./components/ViewUsers.jsx";
import ManageUsers from "./components/ManageUsers.jsx";

const Dashboard = () => {
    
    const[selectedComponent, setSelectedComponent] = useState('');

    const selectComponent = () => {
        switch(selectedComponent){
            case 'add-laptops':
                return <AddLaptops/>;
            case 'manage-laptops':
                return <ManageLaptops/>;
            case 'view-users':
                return <ViewUsers/>;
            case 'manage-users':
                return <ManageUsers/>;
            default:
                return null;
        }
    }


    return(
        <div className="dashboard-container">
            <SideBar selectedComponent={selectedComponent} setSelectedComponent={setSelectedComponent}/>
            <main>
                {selectComponent()}
            </main>
        </div>
    )
}

export default Dashboard;