import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Container, Row, Col } from "react-bootstrap";
import apiClient from "../api/client";
import LaptopCard from "../components/LaptopCard";
import { useAuth } from "../auth/AuthContext";
import { PageShell, PageHeader, LoadingState, EmptyState, ErrorBanner } from "../components/ui";

const Wishlist = () => {
    const navigate = useNavigate();
    const [wishlistItems, setWishlistItems] = useState([]);
    const [laptopDetails, setLaptopDetails] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const { userID } = useAuth();
    const laptopCache = useRef({});

    useEffect(() => {
        async function fetchWishlist() {
            setLoading(true);
            try {
                const response = await apiClient.get(`/wishlist/user/${userID}`);
                setWishlistItems(response.data.data || []);
            } catch (error) {
                if (error.response?.status !== 404) {
                    setError("Failed to load your wishlist. Please try again.");
                }
            } finally {
                setLoading(false);
            }
        }

        if (userID) {
            fetchWishlist();
        }
    }, [userID]);

    useEffect(() => {
        async function fetchLaptopDetails(items) {
            const uniqueIds = [...new Set(items.map(item => item.laptopId))];
            const idsToFetch = uniqueIds.filter(id => !laptopCache.current[id]);

            if (idsToFetch.length > 0) {
                const fetchPromises = idsToFetch.map(id =>
                    apiClient.get(`/laptops/${id}`)
                        .then(response => ({ id, data: response.data }))
                        .catch(() => ({ id, data: null }))
                );

                const results = await Promise.all(fetchPromises);

                results.forEach(({ id, data }) => {
                    if (data) {
                        laptopCache.current[id] = data;
                    }
                });
            }

            const laptops = uniqueIds
                .map(id => laptopCache.current[id])
                .filter(Boolean);

            setLaptopDetails(laptops);
        }

        if (wishlistItems.length > 0) {
            fetchLaptopDetails(wishlistItems);
        } else {
            setLaptopDetails([]);
        }
    }, [wishlistItems]);

    if (loading) {
        return (
            <PageShell>
                <LoadingState message="Loading your wishlist..." fullPage />
            </PageShell>
        );
    }

    return (
        <PageShell>
            <PageHeader
                title="My Wishlist"
                subtitle={laptopDetails.length > 0 ? `${laptopDetails.length} item${laptopDetails.length !== 1 ? 's' : ''} saved` : null}
                showBack
            />

            {error && (
                <ErrorBanner
                    message={error}
                    onDismiss={() => setError('')}
                />
            )}

            {laptopDetails.length === 0 ? (
                <EmptyState
                    icon="search"
                    title="Your wishlist is empty"
                    message="Save items you love to your wishlist to find them easily later."
                    actionText="Browse Laptops"
                    actionLink="/"
                />
            ) : (
                <Row className="products-grid">
                    {laptopDetails.map((laptop) => (
                        <Col key={laptop.id} xs={12} sm={6} lg={4} xl={3} className="mb-4">
                            <LaptopCard laptop={laptop} isInWishlist={true} />
                        </Col>
                    ))}
                </Row>
            )}
        </PageShell>
    );
};

export default Wishlist;
