import React, { useState } from "react";
import '../css/AddLaptops.css';
import axios from 'axios';

const AddLaptops = () => {
    const [price, setPrice] = useState('');
    const [brand, setBrand] = useState('');
    const [image, setImage] = useState(null);
    const [model, setModel] = useState('');
    const [specifications, setSpecifications] = useState('');
    const [stockQuantity, setStockQuantity] = useState('');

    const handleSubmit = (event) => {
        event.preventDefault();

        //api - to backend
        console.log({
            price,
            brand,
            image
        });
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
                        value={price} 
                        onChange={(e) => setPrice(e.target.value)} 
                        required 
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="brand">Brand:</label>
                    <input 
                        id="brand" 
                        value={brand} 
                        onChange={(e) => setBrand(e.target.value)} 
                        required 
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="model">Model:</label>
                    <input 
                        id="model" 
                        value={model} 
                        onChange={(e) => setModel(e.target.value)} 
                        required 
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="specifications">Specifications:</label>
                    <textarea 
                        id="specifications" 
                        value={specifications} 
                        onChange={(e) => setSpecifications(e.target.value)} 
                        required 
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="stockQuantity">Stock Quantity:</label>
                    <input 
                        type="number" 
                        id="stockQuantity" 
                        value={stockQuantity} 
                        onChange={(e) => setStockQuantity(e.target.value)} 
                        required 
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="image">Image:</label>
                    <input 
                        type="file" 
                        id="image" 
                        onChange={(e) => setImage(e.target.files[0])} 
                        required 
                    />
                </div>
                <button type="submit" className="submit-button">Add Laptop</button>
            </form>
        </div>
    );
};

export default AddLaptops;
