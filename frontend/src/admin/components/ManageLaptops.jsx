import React from "react";
import '../css/ManageLaptops.css';
import LaptopCardAdmin from "./LaptopCardAdmin";
import LaptopData from '../../data/data.json';
import { useState, useEffect } from "react";
import { Container,Col, Row } from "react-bootstrap";
import axios from "axios";

const ManageLaptops = () => {

    const[laptops, setLaptop] = useState([]);

    
    useEffect(()=>{
        async function fetchLaptops() {
            try {
                const response = await axios.get(
                    'http://localhost:8080/laptops/get-all'
                );
                setLaptop(response.data.data);
                console.log("Fetched laptops:", response.data);
            } catch (error) {
                console.error("Error fetching data : ", error);
            }
        }
        fetchLaptops();
    },[]);

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