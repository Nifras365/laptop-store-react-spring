import React from "react";
import { Sidebar, Menu, MenuItem, SubMenu } from 'react-pro-sidebar';
import '../css/SideBar.css';

const SideBar = ({setSelectedComponent}) => {
    return (
        <div className="sidebar-container">
            <Sidebar className="sidebar-main">
                <Menu className="sidebar-menu">
                    <SubMenu className="sidebar-submenu" label="Laptops">
                        <MenuItem className="menu-item" onClick={()=>setSelectedComponent('add-laptops')}>Add Laptops</MenuItem>
                        <MenuItem className="menu-item" onClick={()=>setSelectedComponent('manage-laptops')}>Manage Laptops</MenuItem>
                    </SubMenu>
                    <SubMenu className="sidebar-submenu" label="Users">
                        <MenuItem className="menu-item" onClick={()=>setSelectedComponent('view-users')}>View All Users</MenuItem>
                        <MenuItem className="menu-item" onClick={()=>setSelectedComponent('manage-users')}>Manage Users</MenuItem>
                    </SubMenu>
                </Menu>
            </Sidebar>
        </div>
    );
}

export default SideBar;
