import React from "react";
import '../css/LaptopCardAdmin.css';
import { Card, Row, Col } from "react-bootstrap";
import { FaEdit } from "react-icons/fa";

const LaptopCardAdmin = ({id, image, price, description }) =>{
    
    const HandleEditClick = () => {
        console.log("You Clicked the edit button !!!!");
    }
    const HandleDeleteClick = () => {
        console.log("You clicked the delete button !!!!");
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
                    <FaEdit className="iocart" onClick={HandleEditClick}/>
                    </Col>
                    <Col>
                        <button className="buy-now-btn" onClick={HandleDeleteClick}>Delete</button>
                    </Col>
                </Row>
            </Card.Body>
        </Card>
    );
}

export default LaptopCardAdmin;

