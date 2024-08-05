import React from "react";
import '../css/LaptopCardAdmin.css';
import { Card, Row, Col } from "react-bootstrap";

const LaptopCardAdmin = () =>{
    
    const HandleEditClick = () => {

    }
    const HandleDeleteClick = () => {

    }

    return(
        <Card className="laptop-card">
            <Card.Img variant="top" src={image} className="laptop-card-img" />
            <Card.Body>
                <Card.Title>Price: ${price}</Card.Title>
                <Card.Text>
                    {description}
                </Card.Text>
                <Row>
                    <Col>
                    <IoCart className="iocart" onClick={}/>
                    </Col>
                    <Col>
                        <button className="buy-now-btn">Buy Now</button>
                    </Col>
                </Row>
            </Card.Body>
        </Card>
    );
}

export default LaptopCardAdmin;

