import React, { useState, useEffect } from "react";
import '../css/ManageLaptops.css';
import LaptopCardAdmin from "./LaptopCardAdmin";
import axios from 'axios';
import { Col, Modal, Button, Form } from "react-bootstrap";

const ManageLaptops = () => {
    const [laptops, setLaptops] = useState([]);
    const [show, setShow] = useState(false);
    const [formData, setFormData] = useState({
        id: null, image: '', price: '', model: '', brand: '', specifications: '', stockQuantity: ''
    });
    const [imageFile, setImageFile] = useState(null);

    const fetchAllLaptops = async () => {
        try {
            const response = await axios.get('http://localhost:8080/laptops/get-all');
            if (Array.isArray(response.data.data)) {
                setLaptops(response.data.data);
            } else {
                console.error("Expected an array but got:", response.data.data);
                setLaptops([]);
            }
        } catch (error) {
            console.error("Failed to fetch laptops:", error);
            setLaptops([]);
        }
    };

    useEffect(() => {
        fetchAllLaptops();
    }, []);

    const fetchLaptopDetails = async (id) => {
        try {
            const response = await axios.get(`http://localhost:8080/laptops/${id}`);
            const laptop = response.data;
            setFormData({
                id: laptop.id,
                image: laptop.image,
                price: laptop.price,
                model: laptop.model,
                brand: laptop.brand,
                specifications: laptop.specifications,
                stockQuantity: laptop.stockQuantity
            });
        } catch (error) {
            console.error("Failed to fetch laptop details:", error);
        }
    };

    const handleEditClick = (id) => {
        fetchLaptopDetails(id);
        setShow(true);
    };

    const handleDeleteClick = async (id) => {
        try {
            await axios.delete(`http://localhost:8080/laptops/delete-laptop/${id}`);
            alert("Deleted Successfully!");
            fetchAllLaptops();
        } catch (error) {
            console.error("Delete failed:", error);
        }
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

        try {
            await axios.put(`http://localhost:8080/laptops/update-laptop/${formData.id}`, formData);
            alert("Updated Successfully!");
            handleClose();
            fetchAllLaptops();
        } catch (error) {
            console.error("Update failed:", error);
        }
    };

    return (
        <>
            <div className="laptop-cards-container">
                {Array.isArray(laptops) && laptops.length > 0 ? (
                    laptops.map((laptop) => (
                        <Col key={laptop.id} md={4}>
                            <LaptopCardAdmin
                                laptop={laptop}
                                onEdit={handleEditClick}
                                onDelete={handleDeleteClick}
                            />
                        </Col>
                    ))
                ) : (
                    <p>No laptops available</p>
                )}
            </div>

            <Modal show={show} onHide={handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title>Edit Laptop</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {formData && (
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
                    )}
                </Modal.Body>
            </Modal>
        </>
    );
};

export default ManageLaptops;
