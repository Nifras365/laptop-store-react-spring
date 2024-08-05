import React from "react";
import '../css/ManageLaptops.css';
import LaptopCardAdmin from "./LaptopCardAdmin";
import LaptopData from '../data/data.json';
import { useState, useEffect } from "react";

const ManageLaptops = () => {

    const[laptop, setlaptop] = useState([]);

    useEffect(() => {
        setlaptop(LaptopData.laptop)
    },[])

    return(
        <div>
            This page is for manage laptops....
        </div>
    );
}

export default ManageLaptops;