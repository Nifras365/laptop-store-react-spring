import React, { useState, useEffect, useMemo } from "react";
import NavbarBL from "../components/NavbarBL";
import NavbarLogged from "../components/LoggedNavbar/NavbarLogged";
import { Container, Col, Row, Form, InputGroup } from "react-bootstrap";
import { IoSearch, IoFilter, IoClose } from "react-icons/io5";
import LaptopCard from "../components/LaptopCard";
import '../pagescss/welcome.css';
import apiClient from "../api/client";
import { useAuth } from "../auth/AuthContext";
import { EmptyState, ErrorBanner } from "../components/ui";

const SkeletonCard = () => (
    <Col xs={12} sm={6} lg={4} xl={3} className="mb-4">
        <div className="skeleton-card">
            <div className="skeleton-image"></div>
            <div className="skeleton-text"></div>
            <div className="skeleton-text short"></div>
            <div className="skeleton-button"></div>
        </div>
    </Col>
);

const Welcome = () => {
    const [laptops, setLaptops] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const { isAuthenticated } = useAuth();
    
    // Search and Filter State
    const [searchQuery, setSearchQuery] = useState('');
    const [priceRange, setPriceRange] = useState('all');
    const [sortBy, setSortBy] = useState('newest');
    const [showFilters, setShowFilters] = useState(false);
    
    useEffect(() => {
        async function fetchLaptops() {
            try {
                const response = await apiClient.get('/laptops/get-all');
                setLaptops(response.data.data || []);
            } catch (error) {
                setError("Failed to load laptops. Please try again later.");
            } finally {
                setLoading(false);
            }
        }
        fetchLaptops();
    }, []);

    // Get unique brands for filter
    const brands = useMemo(() => {
        const brandSet = new Set(laptops.map(l => l.brand).filter(Boolean));
        return Array.from(brandSet).sort();
    }, [laptops]);

    const [selectedBrand, setSelectedBrand] = useState('all');

    // Filtered and sorted laptops
    const filteredLaptops = useMemo(() => {
        let result = [...laptops];

        // Search filter
        if (searchQuery.trim()) {
            const query = searchQuery.toLowerCase();
            result = result.filter(laptop => 
                laptop.name?.toLowerCase().includes(query) ||
                laptop.brand?.toLowerCase().includes(query) ||
                laptop.processor?.toLowerCase().includes(query)
            );
        }

        // Brand filter
        if (selectedBrand !== 'all') {
            result = result.filter(laptop => laptop.brand === selectedBrand);
        }

        // Price range filter
        if (priceRange !== 'all') {
            const [min, max] = priceRange.split('-').map(Number);
            result = result.filter(laptop => {
                const price = laptop.price || 0;
                if (max) {
                    return price >= min && price <= max;
                }
                return price >= min;
            });
        }

        // Sorting
        switch (sortBy) {
            case 'price-low':
                result.sort((a, b) => (a.price || 0) - (b.price || 0));
                break;
            case 'price-high':
                result.sort((a, b) => (b.price || 0) - (a.price || 0));
                break;
            case 'name':
                result.sort((a, b) => (a.name || '').localeCompare(b.name || ''));
                break;
            default: // newest - keep original order
                break;
        }

        return result;
    }, [laptops, searchQuery, selectedBrand, priceRange, sortBy]);

    const clearFilters = () => {
        setSearchQuery('');
        setSelectedBrand('all');
        setPriceRange('all');
        setSortBy('newest');
    };

    const hasActiveFilters = searchQuery || selectedBrand !== 'all' || priceRange !== 'all' || sortBy !== 'newest';

    const scrollToProducts = () => {
        document.getElementById('products-section')?.scrollIntoView({ behavior: 'smooth' });
    };

    return (
        <div className="welcome-page">
            {isAuthenticated ? <NavbarLogged /> : <NavbarBL />}
            
            <div className="hero-section">
                <Container>
                    <h1 className="hero-title">Find Your Perfect Laptop</h1>
                    <p className="hero-subtitle">Discover the best deals on premium laptops from top brands</p>
                    <button className="hero-button" onClick={scrollToProducts}>
                        Browse Collection
                    </button>
                </Container>
            </div>

            <Container className="main-content" id="products-section">
                {error && (
                    <ErrorBanner 
                        message={error} 
                        onDismiss={() => setError('')}
                    />
                )}

                <div className="search-filter-bar">
                    <div className="search-wrapper">
                        <InputGroup>
                            <InputGroup.Text className="search-icon">
                                <IoSearch size={20} />
                            </InputGroup.Text>
                            <Form.Control
                                type="text"
                                placeholder="Search by name, brand, or processor..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="search-input"
                            />
                            {searchQuery && (
                                <button 
                                    className="search-clear"
                                    onClick={() => setSearchQuery('')}
                                >
                                    <IoClose size={18} />
                                </button>
                            )}
                        </InputGroup>
                    </div>

                    <button 
                        className={`filter-toggle ${showFilters ? 'active' : ''}`}
                        onClick={() => setShowFilters(!showFilters)}
                    >
                        <IoFilter size={20} />
                        <span>Filters</span>
                        {hasActiveFilters && <span className="filter-badge"></span>}
                    </button>
                </div>

                {showFilters && (
                    <div className="filters-panel">
                        <Row>
                            <Col xs={12} sm={6} md={3}>
                                <Form.Group>
                                    <Form.Label>Brand</Form.Label>
                                    <Form.Select 
                                        value={selectedBrand}
                                        onChange={(e) => setSelectedBrand(e.target.value)}
                                    >
                                        <option value="all">All Brands</option>
                                        {brands.map(brand => (
                                            <option key={brand} value={brand}>{brand}</option>
                                        ))}
                                    </Form.Select>
                                </Form.Group>
                            </Col>
                            <Col xs={12} sm={6} md={3}>
                                <Form.Group>
                                    <Form.Label>Price Range</Form.Label>
                                    <Form.Select
                                        value={priceRange}
                                        onChange={(e) => setPriceRange(e.target.value)}
                                    >
                                        <option value="all">All Prices</option>
                                        <option value="0-50000">Under LKR 50000</option>
                                        <option value="50000-100000">LKR 50000 - 100,000</option>
                                        <option value="100000-200000">LKR 100,000 - 200,000</option>
                                        <option value="200000-300000">LKR 200,000 - 300,000</option>
                                        <option value="300000-9999999">LKR 300,000+</option>
                                    </Form.Select>
                                </Form.Group>
                            </Col>
                            <Col xs={12} sm={6} md={3}>
                                <Form.Group>
                                    <Form.Label>Sort By</Form.Label>
                                    <Form.Select
                                        value={sortBy}
                                        onChange={(e) => setSortBy(e.target.value)}
                                    >
                                        <option value="newest">Newest First</option>
                                        <option value="price-low">Price: Low to High</option>
                                        <option value="price-high">Price: High to Low</option>
                                        <option value="name">Name: A-Z</option>
                                    </Form.Select>
                                </Form.Group>
                            </Col>
                            <Col xs={12} sm={6} md={3} className="d-flex align-items-end">
                                {hasActiveFilters && (
                                    <button 
                                        className="clear-filters-btn"
                                        onClick={clearFilters}
                                    >
                                        Clear All Filters
                                    </button>
                                )}
                            </Col>
                        </Row>
                    </div>
                )}

                {!loading && (
                    <div className="results-info">
                        <span className="results-count">
                            {filteredLaptops.length} {filteredLaptops.length === 1 ? 'laptop' : 'laptops'} found
                        </span>
                        {hasActiveFilters && (
                            <button className="clear-filters-link" onClick={clearFilters}>
                                Clear filters
                            </button>
                        )}
                    </div>
                )}
                
                <Row className="products-grid">
                    {loading ? (
                        <>
                            <SkeletonCard />
                            <SkeletonCard />
                            <SkeletonCard />
                            <SkeletonCard />
                            <SkeletonCard />
                            <SkeletonCard />
                            <SkeletonCard />
                            <SkeletonCard />
                        </>
                    ) : filteredLaptops.length === 0 ? (
                        <Col xs={12}>
                            <EmptyState
                                icon="search"
                                title="No laptops found"
                                message={hasActiveFilters 
                                    ? "Try adjusting your search or filters to find what you're looking for."
                                    : "No laptops are available at the moment. Please check back later."}
                                actionText={hasActiveFilters ? "Clear Filters" : null}
                                onAction={hasActiveFilters ? clearFilters : null}
                            />
                        </Col>
                    ) : (
                        filteredLaptops.map((laptop) => (
                            <Col key={laptop.id} xs={12} sm={6} lg={4} xl={3} className="mb-4">
                                <LaptopCard laptop={laptop} />
                            </Col>
                        ))
                    )}
                </Row>
            </Container>

            <footer className="site-footer">
                <Container>
                    <p>&copy; {new Date().getFullYear()} Laptop Store. All rights reserved.</p>
                </Container>
            </footer>
        </div>
    );
}

export default Welcome;