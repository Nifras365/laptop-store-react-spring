import React, { useState } from "react";
import '../css/LaptopCardAdmin.css';
import { Card, Row, Col, Modal, Button, Form } from "react-bootstrap";
import { FaEdit } from "react-icons/fa";
import axios from 'axios';

const LaptopCardAdmin = ({ id, image, price, model, brand, specifications, stockQuantity }) => {
    const [show, setShow] = useState(false);
    const [formData, setFormData] = useState({
        id, image, price, model, brand, specifications, stockQuantity
    });
    const [imageFile, setImageFile] = useState(null);

    const handleEditClick = () => {
        setShow(true);
    };

    const handleClose = () => setShow(false);

    const handleFileChange = (e) => {
        setImageFile(e.target.files[0]);
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        if (imageFile) {
            // Upload image to Cloudinary
            const data = new FormData();
            data.append('file', imageFile);
            data.append('upload_preset', process.env.REACT_APP_CLOUDINARY_UPLOAD_PRESET);

            try {
                const response = await axios.post(
                    `https://api.cloudinary.com/v1_1/${process.env.REACT_APP_CLOUDINARY_CLOUD_NAME}/image/upload`,
                    data
                );
                formData.image = response.data.secure_url;
            } catch (error) {
                console.error('Image upload failed:', error);
                return;
            }
        }

        // Send updated data to backend
        try {
            await axios.put(`http://localhost:8080/laptops/update-laptop/${id}`, formData);
            alert("Updated Successfully!");
            handleClose();
        } catch (error) {
            console.error("Update failed:", error);
        }
    };

    return (
        <>
            <Card className="laptop-card">
                <Card.Img variant="top" src={image} className="laptop-card-img" />
                <Card.Body>
                    <Card.Title>Price: {price} LKR</Card.Title>
                    <Card.Text>{model}</Card.Text>
                    <Row>
                        <Col>
                            <FaEdit className="iocart" onClick={handleEditClick} />
                        </Col>
                        <Col>
                            <button className="buy-now-btn" onClick={() => console.log("Delete clicked!")}>
                                Delete
                            </button>
                        </Col>
                    </Row>
                </Card.Body>
            </Card>

            {/* Edit Popup (Modal) */}
            <Modal show={show} onHide={handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title>Edit Laptop</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form onSubmit={handleSubmit}>
                        <Form.Group>
                            <Form.Label>Price</Form.Label>
                            <Form.Control
                                type="number"
                                name="price"
                                value={formData.price}
                                onChange={handleInputChange}
                            />
                        </Form.Group>
                        <Form.Group>
                            <Form.Label>Brand</Form.Label>
                            <Form.Control
                                type="text"
                                name="brand"
                                value={formData.brand}
                                onChange={handleInputChange}
                            />
                        </Form.Group>
                        <Form.Group>
                            <Form.Label>Model</Form.Label>
                            <Form.Control
                                type="text"
                                name="model"
                                value={formData.model}
                                onChange={handleInputChange}
                            />
                        </Form.Group>
                        <Form.Group>
                            <Form.Label>Specifications</Form.Label>
                            <Form.Control
                                type="text"
                                name="specifications"
                                value={formData.specifications}
                                onChange={handleInputChange}
                            />
                        </Form.Group>
                        <Form.Group>
                            <Form.Label>Stock Quantity</Form.Label>
                            <Form.Control
                                type="number"
                                name="stockQuantity"
                                value={formData.stockQuantity}
                                onChange={handleInputChange}
                            />
                        </Form.Group>
                        <Form.Group>
                            <Form.Label>Image</Form.Label>
                            <Form.Control type="file" onChange={handleFileChange} />
                            <img src={formData.image} alt="Preview" style={{ width: "100px", marginTop: "10px" }} />
                        </Form.Group>
                        <Button variant="primary" type="submit">
                            Save Changes
                        </Button>
                    </Form>
                </Modal.Body>
            </Modal>
        </>
    );
};

export default LaptopCardAdmin;
