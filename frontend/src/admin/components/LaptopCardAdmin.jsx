import React, { useState } from "react";
import '../css/LaptopCardAdmin.css';
import { FaEdit, FaTrash, FaBox } from "react-icons/fa";

const LaptopCardAdmin = ({ laptop, onEdit, onDelete, formatPrice }) => {
    const [imageLoaded, setImageLoaded] = useState(false);

    const handleEditClick = () => {
        onEdit(laptop.id);
    };

    const handleDeleteClick = () => {
        onDelete(laptop.id);
    };

    const isLowStock = laptop.stockQuantity <= 5;
    const isOutOfStock = laptop.stockQuantity === 0;

    return (
        <div className="admin-laptop-card">
            <div className="card-image-wrapper">
                {!imageLoaded && <div className="image-placeholder" />}
                <img 
                    src={laptop.image} 
                    alt={laptop.model}
                    className={`card-image ${imageLoaded ? 'loaded' : ''}`}
                    onLoad={() => setImageLoaded(true)}
                    loading="lazy"
                />
                <div className={`stock-badge ${isOutOfStock ? 'out' : isLowStock ? 'low' : 'in'}`}>
                    <FaBox />
                    <span>{laptop.stockQuantity} in stock</span>
                </div>
            </div>

            <div className="card-content">
                <div className="card-header">
                    <span className="brand-tag">{laptop.brand}</span>
                    <h3 className="card-title">{laptop.model}</h3>
                </div>

                <p className="card-price">
                    {formatPrice ? formatPrice(laptop.price) : `${laptop.price} LKR`}
                </p>

                <div className="card-actions">
                    <button 
                        className="btn-edit"
                        onClick={handleEditClick}
                        title="Edit laptop"
                    >
                        <FaEdit />
                        <span>Edit</span>
                    </button>
                    <button 
                        className="btn-delete"
                        onClick={handleDeleteClick}
                        title="Delete laptop"
                    >
                        <FaTrash />
                        <span>Delete</span>
                    </button>
                </div>
            </div>
        </div>
    );
};

export default LaptopCardAdmin;
