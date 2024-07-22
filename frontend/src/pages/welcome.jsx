import React from "react";
import NavbarBL from "../components/NavbarBL";
import { useState,useEffect } from "react";
import LaptopData from '../data/data.json'

const Welcome = () => {

    const[laptop, setLaptop] = useState({});

    useEffect(()=>{
        setLaptop(LaptopData.laptop)
    })


    return(
    <div>
        <NavbarBL/>
        <h1>Laptop Store</h1>
    </div>
    )
}

export default Welcome;