import React from "react";
import '../css/LaptopCardAdmin.css';
import { Card, Row, Col } from "react-bootstrap";
import { FaEdit } from "react-icons/fa";

const LaptopCardAdmin = ({id, image, price, model }) =>{
    
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
                <Card.Title>Price: {price} LKR</Card.Title>
                <Card.Text>
                    {model}
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

