import React from "react";
import NavbarBL from "../components/NavbarBL";
import { useState,useEffect } from "react";
import LaptopData from '../data/data.json';
import { Container,Col, Row } from "react-bootstrap";
import LaptopCard from "../components/LaptopCard";

const Welcome = () => {

    const[laptops, setLaptop] = useState({});

    useEffect(()=>{
        setLaptop(LaptopData.laptops)
    },[])

    return(
    <div>
        <NavbarBL/>
        <h1>Laptop Store</h1>
        <Container>
            <Row>
                {laptops.map((laptop, index) => (
                    <Col key={index} md={4}>
                        <LaptopCard
                            image={laptop.image}
                            price={laptop.price}
                            description={laptop.description}
                        />
                    </Col>
                ))}
            </Row>
        </Container>
    </div>
    )
}

export default Welcome;