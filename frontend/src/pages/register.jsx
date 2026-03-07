import React, { useState } from "react";
import '../pagescss/auth.css';
import { Container } from "react-bootstrap";
import { IoEye, IoEyeOff, IoCheckmarkCircle } from "react-icons/io5";
import { Link, useNavigate } from "react-router-dom";
import apiClient from "../api/client";
import { PageHeader, ErrorBanner } from "../components/ui";

const Register = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        country: '',
        address: '',
        password: '',
        confirmPassword: ''
    });
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);

    const navigate = useNavigate();

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        setError('');
    };

    const validateForm = () => {
        if (!formData.name || !formData.email || !formData.phone || 
            !formData.country || !formData.address || !formData.password || !formData.confirmPassword) {
            setError("Please fill in all fields");
            return false;
        }
        if (formData.password.length < 6) {
            setError("Password must be at least 6 characters long");
            return false;
        }
        if (formData.password !== formData.confirmPassword) {
            setError("Passwords do not match");
            return false;
        }
        if (!/^\S+@\S+\.\S+$/.test(formData.email)) {
            setError("Please enter a valid email address");
            return false;
        }
        return true;
    };

    const handleRegisterUser = async (event) => {
        event.preventDefault();
        setError('');

        if (!validateForm()) return;

        setIsLoading(true);

        try {
            const response = await apiClient.post('/users/create', formData);
            
            if (response.status === 200) {
                setSuccess(true);
                setTimeout(() => {
                    navigate('/login');
                }, 2000);
            }
        } catch (error) {
            if (error.response?.status === 409) {
                setError("An account with this email already exists.");
            } else {
                setError("Registration failed. Please try again later.");
            }
        } finally {
            setIsLoading(false);
        }
    };

    if (success) {
        return (
            <div className="auth-page">
                <div className="auth-wrapper">
                    <Container className="auth-container success-container">
                        <div className="success-icon">
                            <IoCheckmarkCircle size={64} />
                        </div>
                        <h2>Account Created!</h2>
                        <p>Your account has been created successfully. Redirecting to login...</p>
                    </Container>
                </div>
            </div>
        );
    }

    return (
        <div className="auth-page">
            <div className="auth-wrapper">
                <Container className="auth-container auth-container-wide">
                    <PageHeader 
                        title="Create Account" 
                        subtitle="Join us and start shopping"
                        showBack 
                    />
                    
                    {error && (
                        <ErrorBanner 
                            message={error} 
                            onDismiss={() => setError('')} 
                        />
                    )}

                    <form className="auth-form" onSubmit={handleRegisterUser}>
                        <div className="form-row">
                            <div className="form-group">
                                <label htmlFor="name" className="form-label">Full Name</label>
                                <input
                                    type="text"
                                    id="name"
                                    name="name"
                                    className="form-input"
                                    value={formData.name}
                                    onChange={handleInputChange}
                                    placeholder="Enter your full name"
                                    disabled={isLoading}
                                    required
                                />
                            </div>

                            <div className="form-group">
                                <label htmlFor="email" className="form-label">Email</label>
                                <input
                                    type="email"
                                    id="email"
                                    name="email"
                                    className="form-input"
                                    value={formData.email}
                                    onChange={handleInputChange}
                                    placeholder="Enter your email"
                                    disabled={isLoading}
                                    required
                                />
                            </div>
                        </div>

                        <div className="form-row">
                            <div className="form-group">
                                <label htmlFor="phone" className="form-label">Phone</label>
                                <input
                                    type="tel"
                                    id="phone"
                                    name="phone"
                                    className="form-input"
                                    value={formData.phone}
                                    onChange={handleInputChange}
                                    placeholder="Enter your phone number"
                                    disabled={isLoading}
                                    required
                                />
                            </div>

                            <div className="form-group">
                                <label htmlFor="country" className="form-label">Country</label>
                                <input
                                    type="text"
                                    id="country"
                                    name="country"
                                    className="form-input"
                                    value={formData.country}
                                    onChange={handleInputChange}
                                    placeholder="Enter your country"
                                    disabled={isLoading}
                                    required
                                />
                            </div>
                        </div>

                        <div className="form-group">
                            <label htmlFor="address" className="form-label">Address</label>
                            <input
                                type="text"
                                id="address"
                                name="address"
                                className="form-input"
                                value={formData.address}
                                onChange={handleInputChange}
                                placeholder="Enter your address"
                                disabled={isLoading}
                                required
                            />
                        </div>

                        <div className="form-row">
                            <div className="form-group">
                                <label htmlFor="password" className="form-label">Password</label>
                                <div className="password-input-wrapper">
                                    <input
                                        type={showPassword ? "text" : "password"}
                                        id="password"
                                        name="password"
                                        className="form-input"
                                        value={formData.password}
                                        onChange={handleInputChange}
                                        placeholder="Create a password"
                                        disabled={isLoading}
                                        required
                                    />
                                    <button
                                        type="button"
                                        className="password-toggle"
                                        onClick={() => setShowPassword(!showPassword)}
                                    >
                                        {showPassword ? <IoEyeOff size={20} /> : <IoEye size={20} />}
                                    </button>
                                </div>
                                <p className="form-hint">Must be at least 6 characters</p>
                            </div>

                            <div className="form-group">
                                <label htmlFor="confirmPassword" className="form-label">Confirm Password</label>
                                <div className="password-input-wrapper">
                                    <input
                                        type={showConfirmPassword ? "text" : "password"}
                                        id="confirmPassword"
                                        name="confirmPassword"
                                        className="form-input"
                                        value={formData.confirmPassword}
                                        onChange={handleInputChange}
                                        placeholder="Confirm your password"
                                        disabled={isLoading}
                                        required
                                    />
                                    <button
                                        type="button"
                                        className="password-toggle"
                                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                    >
                                        {showConfirmPassword ? <IoEyeOff size={20} /> : <IoEye size={20} />}
                                    </button>
                                </div>
                            </div>
                        </div>

                        <button 
                            type="submit" 
                            className="auth-submit-btn btn-primary"
                            disabled={isLoading}
                        >
                            {isLoading ? (
                                <>
                                    <span className="loading-spinner loading-spinner-sm"></span>
                                    <span>Creating account...</span>
                                </>
                            ) : (
                                'Create Account'
                            )}
                        </button>

                        <div className="auth-footer">
                            <span>Already have an account?</span>
                            <Link to="/login" className="auth-link">
                                Sign In
                            </Link>
                        </div>
                    </form>
                </Container>
            </div>
        </div>
    );
};

export default Register;