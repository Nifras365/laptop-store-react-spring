import React from "react";
import NavbarBL from "../components/NavbarBL";
import { useState,useEffect } from "react";
import LaptopData from '../data/data.json';
import { Container,Col, Row } from "react-bootstrap";
import LaptopCard from "../components/LaptopCard";

const Welcome = () => {

    const[laptop, setLaptop] = useState({});

    useEffect(()=>{
        setLaptop(LaptopData.laptop)
    },[])

    return(
    <div>
        <NavbarBL/>
        <h1>Laptop Store</h1>
        <Container>
            <Row>
                <Col>
                <LaptopCard
                    image={laptop.image}
                    description={laptop.description}
                    price={laptop.price}
                />
                </Col>
            </Row>
        </Container>
    </div>
    )
}

export default Welcome;