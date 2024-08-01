import React from "react";
import {Sidebar, Menu, MenuItem, SubMenu} from 'react-pro-sidebar';

const SideBar = () => {
    return(
        <div>
            <Sidebar>
                <Menu>
                    <SubMenu label="Laptops">
                        <MenuItem>Add Laptops</MenuItem>
                        <MenuItem>Manage Laptops</MenuItem>
                    </SubMenu>
                    <SubMenu label="Users">
                        <MenuItem>Add Laptops</MenuItem>
                        <MenuItem>Manage Users</MenuItem>
                    </SubMenu>
                </Menu>
            </Sidebar>
        </div>
    );
}

export default SideBar;