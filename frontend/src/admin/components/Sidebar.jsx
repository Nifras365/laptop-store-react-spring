import React from "react";
import {Sidebar, Menu, MenuItem} from 'react-pro-sidebar';

const SideBar = () => {
    return(
        <div>
            <Sidebar>
                <Menu>
                    <MenuItem>Laptops</MenuItem>
                </Menu>
            </Sidebar>
        </div>
    );
}

export default SideBar;