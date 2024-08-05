import React from "react";
import '../css/ManageLaptops.css';
import LaptopCardAdmin from "./LaptopCardAdmin";
import LaptopData from '../../data/data.json';
import { useState, useEffect } from "react";
import { Container,Col, Row } from "react-bootstrap";

const ManageLaptops = () => {

    const[laptops, setlaptops] = useState([]);

    useEffect(() => {
        setlaptops(LaptopData.laptops)
    },[])

    return(
        <div>
            This page is for manage laptops....
            <div>
            <Container>
            <Row>
                {laptops.map((laptop) => (
                    <Col key={laptop.id} md={4}>
                        <LaptopCardAdmin
                            image={laptop.image}
                            price={laptop.price}
                            description={laptop.description}
                        />
                    </Col>
                ))}
            </Row>
            </Container>
            </div>
        </div>
    );
}

export default ManageLaptops;