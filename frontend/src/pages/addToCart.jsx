import CartCard from "../components/CartCard";
import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { PageShell, PageHeader, EmptyState } from "../components/ui";

const AddToCart = () => {
    const location = useLocation();
    const { id, image, price, model, stockQuantity } = location.state || {};
    const navigate = useNavigate();

    return (
        <PageShell>
            <PageHeader 
                title="Add to Cart" 
                subtitle="Review and add this item to your cart"
                showBack 
            />
            
            {id ? (
                <CartCard laptop={{ id, image, price, model, stockQuantity }} />
            ) : (
                <EmptyState
                    icon="cart"
                    title="No item selected"
                    message="Please select a laptop from the store to add to your cart."
                    actionText="Browse Laptops"
                    actionLink="/"
                />
            )}
        </PageShell>
    );
};

export default AddToCart;