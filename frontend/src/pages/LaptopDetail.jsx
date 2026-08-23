import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Container, Row, Col, Button } from "react-bootstrap";
import { BsCartPlus, BsCheckCircle, BsXCircle, BsArrowLeft, BsHeart, BsHeartFill } from "react-icons/bs";
import NavbarBL from "../components/NavbarBL";
import NavbarLogged from "../components/LoggedNavbar/NavbarLogged";
import apiClient from "../api/client";
import { useAuth } from "../auth/AuthContext";
import { useToast } from "../contexts/ToastContext";
import { LoadingState, ErrorBanner } from "../components/ui";

const LaptopDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { isAuthenticated } = useAuth();
    
    const [laptop, setLaptop] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [inWishlist, setInWishlist] = useState(false);
    const { userID } = useAuth();
    const { addToast } = useToast();

    useEffect(() => {
        const fetchLaptop = async () => {
            try {
                const response = await apiClient.get(`/laptops/${id}`);
                setLaptop(response.data);

                if (isAuthenticated && userID) {
                    const wishRes = await apiClient.get(`/wishlist/check/${userID}/${id}`);
                    setInWishlist(wishRes.data.data);
                }
            } catch (err) {
                setError("Failed to load laptop details. It may not exist.");
            } finally {
                setLoading(false);
            }
        };
        fetchLaptop();
    }, [id, isAuthenticated, userID]);

    const formatPrice = (price) => {
        return new Intl.NumberFormat('en-US', {
            style: 'decimal',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0
        }).format(price);
    };

    const handleAddToCart = () => {
        if (!isAuthenticated) {
            navigate('/login');
            return;
        }
        navigate('/addToCart', { 
            state: { 
                id: laptop.id, 
                image: laptop.image, 
                price: laptop.price, 
                model: laptop.model,
                stockQuantity: laptop.stockQuantity 
            } 
        });
    };

    const handleToggleWishlist = async () => {
        if (!isAuthenticated) {
            navigate('/login');
            return;
        }
        try {
            if (inWishlist) {
                await apiClient.delete(`/wishlist/remove/${userID}/${laptop.id}`);
                setInWishlist(false);
                addToast(`${laptop.model} removed from wishlist`, 'info');
            } else {
                await apiClient.post('/wishlist/add', {
                    userId: userID,
                    laptopId: laptop.id
                });
                setInWishlist(true);
                addToast(`${laptop.model} added to wishlist`, 'success');
            }
        } catch (error) {
            addToast('Failed to update wishlist', 'error');
            console.error("Failed to toggle wishlist", error);
        }
    };

    if (loading) return (
        <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
            {isAuthenticated ? <NavbarLogged /> : <NavbarBL />}
            <LoadingState message="Loading laptop details..." />
        </div>
    );

    if (error || !laptop) return (
        <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
            {isAuthenticated ? <NavbarLogged /> : <NavbarBL />}
            <Container className="mt-5">
                <ErrorBanner message={error || "Laptop not found"} onDismiss={() => navigate('/')} />
                <Button variant="outline-primary" onClick={() => navigate('/')} className="mt-3">
                    <BsArrowLeft className="me-2" /> Back to Store
                </Button>
            </Container>
        </div>
    );

    const isInStock = laptop.stockQuantity > 0;

    return (
        <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', backgroundColor: 'var(--bg-secondary)' }}>
            {isAuthenticated ? <NavbarLogged /> : <NavbarBL />}
            
            <Container className="py-5">
                <Button variant="link" onClick={() => navigate('/')} style={{ textDecoration: 'none', color: 'var(--text-secondary)', marginBottom: '20px', padding: 0 }}>
                    <BsArrowLeft className="me-2" /> Back to Store
                </Button>

                <div style={{ backgroundColor: 'var(--card-bg)', borderRadius: '16px', padding: '40px', boxShadow: '0 4px 6px rgba(0,0,0,0.05)' }}>
                    <Row>
                        <Col lg={6} className="mb-4 mb-lg-0 text-center" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <img 
                                src={laptop.image} 
                                alt={laptop.model} 
                                style={{ maxWidth: '100%', maxHeight: '500px', objectFit: 'contain' }} 
                            />
                        </Col>
                        
                        <Col lg={6}>
                            <h1 style={{ fontWeight: 700, color: 'var(--text-primary)', marginBottom: '10px' }}>
                                {laptop.brand} {laptop.model}
                            </h1>
                            
                            <div style={{ display: 'flex', alignItems: 'center', marginBottom: '20px' }}>
                                <span style={{ fontSize: '2rem', fontWeight: 700, color: 'var(--primary-color)' }}>
                                    {formatPrice(laptop.price)} <span style={{ fontSize: '1rem', color: 'var(--text-secondary)' }}>LKR</span>
                                </span>
                            </div>

                            <div style={{ 
                                display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '8px 16px', 
                                borderRadius: '30px', fontWeight: 600, marginBottom: '30px',
                                backgroundColor: isInStock ? 'rgba(16, 185, 129, 0.1)' : 'rgba(239, 68, 68, 0.1)',
                                color: isInStock ? '#10b981' : '#ef4444'
                            }}>
                                {isInStock ? (
                                    <><BsCheckCircle /> In Stock ({laptop.stockQuantity} units available)</>
                                ) : (
                                    <><BsXCircle /> Out of Stock</>
                                )}
                            </div>

                            <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: '30px', marginBottom: '30px' }}>
                                <h4 style={{ fontWeight: 600, marginBottom: '20px' }}>Product Details</h4>
                                <div style={{ display: 'grid', gap: '15px' }}>
                                    <div style={{ display: 'grid', gridTemplateColumns: '120px 1fr', gap: '10px' }}>
                                        <span style={{ color: 'var(--text-secondary)', fontWeight: 500 }}>Brand</span>
                                        <span style={{ fontWeight: 500 }}>{laptop.brand}</span>
                                    </div>
                                    <div style={{ display: 'grid', gridTemplateColumns: '120px 1fr', gap: '10px' }}>
                                        <span style={{ color: 'var(--text-secondary)', fontWeight: 500 }}>Model</span>
                                        <span style={{ fontWeight: 500 }}>{laptop.model}</span>
                                    </div>
                                    {laptop.processor && (
                                        <div style={{ display: 'grid', gridTemplateColumns: '120px 1fr', gap: '10px' }}>
                                            <span style={{ color: 'var(--text-secondary)', fontWeight: 500 }}>Processor</span>
                                            <span style={{ fontWeight: 500 }}>{laptop.processor}</span>
                                        </div>
                                    )}
                                    {laptop.specifications && (
                                        <div style={{ display: 'grid', gridTemplateColumns: '120px 1fr', gap: '10px' }}>
                                            <span style={{ color: 'var(--text-secondary)', fontWeight: 500 }}>Specifications</span>
                                            <span style={{ lineHeight: 1.6 }}>{laptop.specifications}</span>
                                        </div>
                                    )}
                                </div>
                            </div>

                            <div style={{ display: 'flex', gap: '15px' }}>
                                <Button 
                                    variant="outline-secondary" 
                                    size="lg"
                                    style={{ 
                                        padding: '15px 25px', 
                                        fontWeight: 600, 
                                        display: 'flex', 
                                        alignItems: 'center', 
                                        justifyContent: 'center',
                                        color: inWishlist ? 'var(--danger)' : 'var(--gray-600)',
                                        borderColor: inWishlist ? 'var(--danger)' : 'var(--gray-300)'
                                    }}
                                    onClick={handleToggleWishlist}
                                >
                                    {inWishlist ? <BsHeartFill size={22} /> : <BsHeart size={22} />}
                                </Button>
                                
                                <Button 
                                    variant="primary" 
                                    size="lg"
                                    style={{ flex: 1, padding: '15px', fontWeight: 600, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px' }}
                                    onClick={handleAddToCart}
                                    disabled={!isInStock}
                                >
                                    <BsCartPlus size={22} />
                                    {isInStock ? 'Add to Cart' : 'Currently Unavailable'}
                                </Button>
                            </div>
                        </Col>
                    </Row>
                </div>
            </Container>
        </div>
    );
};

export default LaptopDetail;
