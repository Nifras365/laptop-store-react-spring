import React from "react";
import {Sidebar, Menu, MenuItem, SubMenu} from 'react-pro-sidebar';
import '../css/SideBar.css';

const SideBar = () => {
    return(
        <div>
            <Sidebar className="sidebar-main">
                <Menu className="sidebar-menu">
                    <SubMenu className="sidebar-submenu" label="Laptops">
                        <MenuItem>Add Laptops</MenuItem>
                        <MenuItem>Manage Laptops</MenuItem>
                    </SubMenu>
                    <SubMenu className="sidebar-submenu" label="Users">
                        <MenuItem>View All Users</MenuItem>
                        <MenuItem>Manage Users</MenuItem>
                    </SubMenu>
                </Menu>
            </Sidebar>
        </div>
    );
}

export default SideBar;