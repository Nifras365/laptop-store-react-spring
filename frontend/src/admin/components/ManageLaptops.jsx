import React, { useState, useEffect } from "react";
import '../css/ManageLaptops.css';
import LaptopCardAdmin from "./LaptopCardAdmin";
import apiClient from '../../api/client';
import axios from 'axios';
import { Modal, Button, Form, Spinner } from "react-bootstrap";
import { ConfirmModal } from "../../components/ui";
import { FaTimes, FaBoxOpen } from "react-icons/fa";

const ManageLaptops = () => {
    const [laptops, setLaptops] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [show, setShow] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [deleteConfirm, setDeleteConfirm] = useState({ show: false, id: null, name: '' });
    const [formData, setFormData] = useState({
        id: null, image: '', price: '', model: '', brand: '', specifications: '', stockQuantity: ''
    });
    const [imageFile, setImageFile] = useState(null);

    const fetchAllLaptops = async () => {
        setLoading(true);
        setError('');
        try {
            const response = await apiClient.get('/laptops/get-all');
            if (Array.isArray(response.data.data)) {
                setLaptops(response.data.data);
            } else {
                console.error("Expected an array but got:", response.data.data);
                setLaptops([]);
            }
        } catch (err) {
            console.error("Failed to fetch laptops:", err);
            setError('Failed to load laptops. Please try again.');
            setLaptops([]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchAllLaptops();
    }, []);

    const fetchLaptopDetails = async (id) => {
        try {
            const response = await apiClient.get(`/laptops/${id}`);
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
        } catch (err) {
            console.error("Failed to fetch laptop details:", err);
            setError('Failed to load laptop details.');
        }
    };

    const handleEditClick = (id) => {
        fetchLaptopDetails(id);
        setShow(true);
    };

    const handleDeleteClick = (id, name) => {
        setDeleteConfirm({ show: true, id, name });
    };

    const confirmDelete = async () => {
        try {
            await apiClient.delete(`/laptops/delete-laptop/${deleteConfirm.id}`);
            setDeleteConfirm({ show: false, id: null, name: '' });
            fetchAllLaptops();
        } catch (err) {
            console.error("Delete failed:", err);
            setError('Failed to delete laptop.');
        }
    };

    const handleClose = () => {
        setShow(false);
        setImageFile(null);
    };

    const handleFileChange = (e) => {
        setImageFile(e.target.files[0]);
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        setIsSubmitting(true);

        let updatedFormData = { ...formData };

        if (imageFile) {
            const data = new FormData();
            data.append('file', imageFile);
            data.append('upload_preset', process.env.REACT_APP_CLOUDINARY_UPLOAD_PRESET);

            try {
                const response = await axios.post(
                    `https://api.cloudinary.com/v1_1/${process.env.REACT_APP_CLOUDINARY_CLOUD_NAME}/image/upload`,
                    data
                );
                updatedFormData.image = response.data.secure_url;
            } catch (err) {
                console.error('Image upload failed:', err);
                setError('Image upload failed. Please try again.');
                setIsSubmitting(false);
                return;
            }
        }

        try {
            await apiClient.put(`/laptops/update-laptop/${formData.id}`, updatedFormData);
            handleClose();
            fetchAllLaptops();
        } catch (err) {
            console.error("Update failed:", err);
            setError('Failed to update laptop.');
        } finally {
            setIsSubmitting(false);
        }
    };

    const formatPrice = (price) => {
        return new Intl.NumberFormat('en-LK', {
            style: 'currency',
            currency: 'LKR',
            minimumFractionDigits: 0,
        }).format(price);
    };

    if (loading) {
        return (
            <div className="manage-laptops-loading">
                <Spinner animation="border" variant="primary" />
                <p>Loading laptops...</p>
            </div>
        );
    }

    return (
        <div className="manage-laptops-container">
            <div className="manage-header">
                <h2>Manage Laptops</h2>
                <p>{laptops.length} laptop{laptops.length !== 1 ? 's' : ''} in inventory</p>
            </div>

            {error && (
                <div className="error-banner">
                    <span>{error}</span>
                    <button onClick={() => setError('')}><FaTimes /></button>
                </div>
            )}

            {laptops.length === 0 ? (
                <div className="empty-state">
                    <FaBoxOpen className="empty-icon" />
                    <h3>No laptops in inventory</h3>
                    <p>Add your first laptop to get started</p>
                </div>
            ) : (
                <div className="laptops-grid">
                    {laptops.map((laptop) => (
                        <LaptopCardAdmin
                            key={laptop.id}
                            laptop={laptop}
                            onEdit={handleEditClick}
                            onDelete={(id) => handleDeleteClick(id, laptop.model)}
                            formatPrice={formatPrice}
                        />
                    ))}
                </div>
            )}

            {/* Edit Modal */}
            <Modal show={show} onHide={handleClose} centered className="edit-laptop-modal">
                <Modal.Header closeButton>
                    <Modal.Title>Edit Laptop</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {formData && (
                        <Form onSubmit={handleSubmit}>
                            <div className="modal-form-grid">
                                <Form.Group className="mb-3">
                                    <Form.Label>Brand</Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="brand"
                                        value={formData.brand}
                                        onChange={handleInputChange}
                                    />
                                </Form.Group>
                                <Form.Group className="mb-3">
                                    <Form.Label>Model</Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="model"
                                        value={formData.model}
                                        onChange={handleInputChange}
                                    />
                                </Form.Group>
                                <Form.Group className="mb-3">
                                    <Form.Label>Price (LKR)</Form.Label>
                                    <Form.Control
                                        type="number"
                                        name="price"
                                        value={formData.price}
                                        onChange={handleInputChange}
                                    />
                                </Form.Group>
                                <Form.Group className="mb-3">
                                    <Form.Label>Stock Quantity</Form.Label>
                                    <Form.Control
                                        type="number"
                                        name="stockQuantity"
                                        value={formData.stockQuantity}
                                        onChange={handleInputChange}
                                    />
                                </Form.Group>
                            </div>
                            <Form.Group className="mb-3">
                                <Form.Label>Specifications</Form.Label>
                                <Form.Control
                                    as="textarea"
                                    rows={3}
                                    name="specifications"
                                    value={formData.specifications}
                                    onChange={handleInputChange}
                                />
                            </Form.Group>
                            <Form.Group className="mb-3">
                                <Form.Label>Image</Form.Label>
                                <Form.Control type="file" onChange={handleFileChange} />
                                {formData.image && (
                                    <img 
                                        src={formData.image} 
                                        alt="Preview" 
                                        className="image-preview mt-2"
                                    />
                                )}
                            </Form.Group>
                            <div className="modal-actions">
                                <Button variant="secondary" onClick={handleClose}>
                                    Cancel
                                </Button>
                                <Button 
                                    variant="primary" 
                                    type="submit"
                                    disabled={isSubmitting}
                                >
                                    {isSubmitting ? (
                                        <>
                                            <Spinner size="sm" className="me-2" />
                                            Saving...
                                        </>
                                    ) : (
                                        'Save Changes'
                                    )}
                                </Button>
                            </div>
                        </Form>
                    )}
                </Modal.Body>
            </Modal>

            {/* Delete Confirmation */}
            <ConfirmModal
                show={deleteConfirm.show}
                onHide={() => setDeleteConfirm({ show: false, id: null, name: '' })}
                onConfirm={confirmDelete}
                title="Delete Laptop"
                message={`Are you sure you want to delete "${deleteConfirm.name}"? This action cannot be undone.`}
                confirmText="Delete"
                variant="danger"
            />
        </div>
    );
};

export default ManageLaptops;
