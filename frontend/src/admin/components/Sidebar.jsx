import React from "react";
import { Sidebar, Menu, MenuItem, SubMenu } from 'react-pro-sidebar';
import '../css/SideBar.css';

const SideBar = ({setSelectedComponent}) => {
    return (
        <div className="sidebar-container">
            <Sidebar className="sidebar-main">
                <Menu className="sidebar-menu">
                    <SubMenu className="sidebar-submenu" label="Laptops">
                        <MenuItem className="menu-item" >Add Laptops</MenuItem>
                        <MenuItem className="menu-item">Manage Laptops</MenuItem>
                    </SubMenu>
                    <SubMenu className="sidebar-submenu" label="Users">
                        <MenuItem className="menu-item">View All Users</MenuItem>
                        <MenuItem className="menu-item">Manage Users</MenuItem>
                    </SubMenu>
                </Menu>
            </Sidebar>
        </div>
    );
}

export default SideBar;
