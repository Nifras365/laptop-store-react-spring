import React from "react";
import NavbarBL from "../components/NavbarBL";
import NavbarLogged from "../components/LoggedNavbar/NavbarLogged";
import { useState,useEffect } from "react";
import { Container,Col, Row } from "react-bootstrap";
import LaptopCard from "../components/LaptopCard";
import '../pagescss/welcome.css';
import axios from "axios";

const Welcome = () => {

    const[laptops, setLaptop] = useState([]);
    const token = localStorage.getItem('token');
   
    useEffect(()=>{
        async function fetchLaptops() {
            try {
                const response = await axios.get(
                    'http://localhost:8080/laptops/get-all'
                );
                setLaptop(response.data.data);
                console.log("Fetched laptops:", response.data.data);
            } catch (error) {
                console.error("Error fetching data : ", error);
            }
        }
        fetchLaptops();
    },[]);

    return(
    <div>
        {token ? <NavbarLogged/> : <NavbarBL/>}
        <div className="label-container">
        <label className="label-01">Latest Featured Products</label>
        </div>
        <Container>
            <Row>
                {laptops.map((laptop) => (
                    <Col key={laptop.id} md={4}>
                        <LaptopCard
                            laptop={laptop}
                        />
                    </Col>
                ))}
            </Row>
        </Container>
    </div>
    )
}

export default Welcome;