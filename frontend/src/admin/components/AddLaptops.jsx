import React, { useState } from "react";
import '../css/AddLaptops.css';

const AddLaptops = () => {
    const [price, setPrice] = useState('');
    const [description, setDescription] = useState('');
    const [image, setImage] = useState(null);

    const handleSubmit = (event) => {
        event.preventDefault();

        //api
        console.log({
            price,
            description,
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
                    <label htmlFor="description">Description:</label>
                    <textarea 
                        id="description" 
                        value={description} 
                        onChange={(e) => setDescription(e.target.value)} 
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
