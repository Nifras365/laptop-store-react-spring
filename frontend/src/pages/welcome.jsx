import React from "react";
import NavbarBL from "../components/NavbarBL";
import { useState,useEffect } from "react";

const Welcome = () => {

    const[laptop, setLaptop] = useState({});


    return(
    <div>
        <NavbarBL/>
        <h1>Laptop Store</h1>
    </div>
    )
}

export default Welcome;