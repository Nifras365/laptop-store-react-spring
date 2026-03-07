import React, { useState } from "react";
import '../css/AddLaptops.css';
import axios from 'axios';
import apiClient from '../../api/client';
import { FaUpload, FaCheck, FaSpinner, FaTimes } from "react-icons/fa";

const AddLaptops = () => {
    const [imageFile, setImageFile] = useState(null);
    const [imagePreview, setImagePreview] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState('');

    const [formData, setFormData] = useState({
        price: '',
        brand: '',
        image: '',
        model: '',
        specifications: '',
        stockQuantity: '',
    });

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
        setError('');
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setImageFile(file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const removeImage = () => {
        setImageFile(null);
        setImagePreview(null);
    };

    const resetForm = () => {
        setFormData({
            price: '',
            brand: '',
            image: '',
            model: '',
            specifications: '',
            stockQuantity: '',
        });
        setImageFile(null);
        setImagePreview(null);
        setSuccess(false);
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        setIsSubmitting(true);
        setError('');

        const data = new FormData(); 
        data.append('file', imageFile);
        data.append('upload_preset', process.env.REACT_APP_CLOUDINARY_UPLOAD_PRESET);

        try {
            // Cloudinary upload uses regular axios (external API)
            const cloudinaryResponse = await axios.post(
                `https://api.cloudinary.com/v1_1/${process.env.REACT_APP_CLOUDINARY_CLOUD_NAME}/image/upload`, 
                data
            );
            
            const imageUrl = cloudinaryResponse.data.secure_url;
            
            const laptopData = {
                ...formData,
                image: imageUrl
            };
            
            // Use centralized apiClient for backend API
            await apiClient.post('/laptops/create', laptopData);
            
            setSuccess(true);
        } catch (err) {
            console.error('Failed to add laptop:', err);
            setError(err.response?.data?.message || 'Failed to add laptop. Please try again.');
        } finally {
            setIsSubmitting(false);
        }
    };

    if (success) {
        return (
            <div className="add-laptops-container">
                <div className="success-state">
                    <div className="success-icon">
                        <FaCheck />
                    </div>
                    <h2>Laptop Added Successfully!</h2>
                    <p>The new laptop has been added to the inventory.</p>
                    <button className="btn-primary" onClick={resetForm}>
                        Add Another Laptop
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="add-laptops-container">
            <div className="form-header">
                <h2>Add New Laptop</h2>
                <p>Fill in the details below to add a new laptop to inventory</p>
            </div>

            {error && (
                <div className="error-banner">
                    <span>{error}</span>
                    <button onClick={() => setError('')}><FaTimes /></button>
                </div>
            )}

            <form onSubmit={handleSubmit} className="add-laptops-form">
                <div className="form-grid">
                    <div className="form-group">
                        <label htmlFor="brand">Brand</label>
                        <input 
                            type="text"
                            id="brand" 
                            name="brand"  
                            value={formData.brand} 
                            onChange={handleInputChange} 
                            placeholder="e.g., Apple, Dell, HP"
                            required 
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="model">Model</label>
                        <input 
                            type="text"
                            id="model" 
                            name="model"  
                            value={formData.model} 
                            onChange={handleInputChange} 
                            placeholder="e.g., MacBook Pro 14"
                            required 
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="price">Price (LKR)</label>
                        <input 
                            type="number" 
                            id="price" 
                            name="price"  
                            value={formData.price} 
                            onChange={handleInputChange}
                            placeholder="e.g., 450000"
                            min="0"
                            required 
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="stockQuantity">Stock Quantity</label>
                        <input 
                            type="number" 
                            id="stockQuantity" 
                            name="stockQuantity"  
                            value={formData.stockQuantity} 
                            onChange={handleInputChange}
                            placeholder="e.g., 10"
                            min="0"
                            required 
                        />
                    </div>
                </div>

                <div className="form-group full-width">
                    <label htmlFor="specifications">Specifications</label>
                    <textarea 
                        id="specifications" 
                        name="specifications"  
                        value={formData.specifications} 
                        onChange={handleInputChange}
                        placeholder="Enter laptop specifications (RAM, Storage, Processor, Display, etc.)"
                        rows="4"
                        required 
                    />
                </div>

                <div className="form-group full-width">
                    <label>Product Image</label>
                    {imagePreview ? (
                        <div className="image-preview">
                            <img src={imagePreview} alt="Preview" />
                            <button 
                                type="button" 
                                className="remove-image"
                                onClick={removeImage}
                            >
                                <FaTimes />
                            </button>
                        </div>
                    ) : (
                        <label className="file-upload">
                            <input 
                                type="file" 
                                accept="image/*"
                                onChange={handleFileChange}
                                required 
                            />
                            <FaUpload />
                            <span>Click to upload image</span>
                            <small>PNG, JPG up to 5MB</small>
                        </label>
                    )}
                </div>

                <button 
                    type="submit" 
                    className="submit-button"
                    disabled={isSubmitting || !imageFile}
                >
                    {isSubmitting ? (
                        <>
                            <FaSpinner className="spinner" />
                            Uploading...
                        </>
                    ) : (
                        'Add Laptop'
                    )}
                </button>
            </form>
        </div>
    );
};

export default AddLaptops;
