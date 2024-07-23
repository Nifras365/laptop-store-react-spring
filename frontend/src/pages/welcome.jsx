import React from "react";
import NavbarBL from "../components/NavbarBL";
import { useState,useEffect } from "react";
import LaptopData from '../data/data.json';
import { Container,Col, Row } from "react-bootstrap";
import LaptopCard from "../components/LaptopCard";
import '../pagescss/welcome.css'

const Welcome = () => {

    const[laptops, setLaptop] = useState([]);

    useEffect(()=>{
        setLaptop(LaptopData.laptops)
    },[])

    return(
    <div>
        <NavbarBL/>
        <div className="label-container">
        <label className="label-01">Latest Featured Products</label>
        </div>
        <Container>
            <Row>
                {laptops.map((laptop) => (
                    <Col key={laptop.id} md={4}>
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