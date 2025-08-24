import React, { useState, useEffect } from "react";
import NavbarBL from "../components/NavbarBL";
import NavbarLogged from "../components/LoggedNavbar/NavbarLogged";
import { Container, Col, Row, Button } from "react-bootstrap";
import LaptopCard from "../components/LaptopCard";
import '../pagescss/welcome.css';
import axios from "axios";

const SkeletonCard = () => (
    <Col xs={12} sm={6} lg={4} className="mb-4">
        <div className="skeleton-card">
            <div className="skeleton-image"></div>
            <div className="skeleton-text"></div>
            <div className="skeleton-text short"></div>
        </div>
    </Col>
);


const Welcome = () => {
    const [laptops, setLaptops] = useState([]);
    const [loading, setLoading] = useState(true); 
    const token = localStorage.getItem('token');
    
    useEffect(() => {
        async function fetchLaptops() {
            try {
                const response = await axios.get('http://localhost:8080/laptops/get-all');
                setLaptops(response.data.data);
            } catch (error) {
                console.error("Error fetching data : ", error);
            } finally {
                setLoading(false); 
            }
        }
        fetchLaptops();
    },[]);

    return (
            <div>
                {token ? <NavbarLogged /> : <NavbarBL />}
                <div className="hero-section">
                    <Container>
                        <h1 className="hero-title">Find Your Next Powerhouse</h1>
                        <p className="hero-subtitle">The best deals on the latest laptops, right here.</p>
                        <Button variant="primary" size="lg" className="hero-button">Shop All Laptops</Button>
                    </Container>
                </div>
                <Container className="main-content">
                    <h2 className="section-title">Latest Featured Products</h2>
                    
                    <Row>
                        {loading ? (
                            <>
                                <SkeletonCard />
                                <SkeletonCard />
                                <SkeletonCard />
                                <SkeletonCard />
                                <SkeletonCard />
                                <SkeletonCard />
                            </>
                        ) : (
                            laptops.map((laptop) => (
                                <Col key={laptop.id} xs={12} sm={6} lg={4} className="mb-4">
                                    <LaptopCard laptop={laptop} />
                                </Col>
                            ))
                        )}
                    </Row>
                </Container>
            </div>
    );
}

export default Welcome;