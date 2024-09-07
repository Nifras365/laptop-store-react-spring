import React, { useState } from "react";
import '../css/AddLaptops.css';
import axios from 'axios';

const AddLaptops = () => {

    const [imageFile, setImageFile] = useState(null);

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
    };

    const handleFileChange = (e) => {
        setImageFile(e.target.files[0]);
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        
        const data = new FormData(); 
        data.append('file', imageFile);
        data.append('upload_preset', process.env.REACT_APP_CLOUDINARY_UPLOAD_PRESET);

        try {
            const response = await axios.post(`https://api.cloudinary.com/v1_1/${process.env.REACT_APP_CLOUDINARY_CLOUD_NAME}/image/upload`, data);
            formData.image = response.data.secure_url;

            console.log(formData);

        } catch (error) {
            console.error('Image upload failed:', error);
        }
    };

    return (
        <div className="add-laptops-container">
            <h2>Add New Laptop</h2>
            <form onSubmit={handleSubmit} className="add-laptops-form">
                <div className="form-group">
                    <label htmlFor="price">Price:</label>
                    <input 
                        type="number" 
                        id="price" 
                        name="price"  
                        value={formData.price} 
                        onChange={handleInputChange} 
                        required 
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="brand">Brand:</label>
                    <input 
                        id="brand" 
                        name="brand"  
                        value={formData.brand} 
                        onChange={handleInputChange} 
                        required 
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="model">Model:</label>
                    <input 
                        id="model" 
                        name="model"  
                        value={formData.model} 
                        onChange={handleInputChange} 
                        required 
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="specifications">Specifications:</label>
                    <textarea 
                        id="specifications" 
                        name="specifications"  
                        value={formData.specifications} 
                        onChange={handleInputChange} 
                        required 
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="stockQuantity">Stock Quantity:</label>
                    <input 
                        type="number" 
                        id="stockQuantity" 
                        name="stockQuantity"  
                        value={formData.stockQuantity} 
                        onChange={handleInputChange} 
                        required 
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="image">Image:</label>
                    <input 
                        type="file" 
                        id="image" 
                        onChange={handleFileChange} 
                        required 
                    />
                </div>
                <button type="submit" className="submit-button">Add Laptop</button>
            </form>
        </div>
    );
};

export default AddLaptops;
