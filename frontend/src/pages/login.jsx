import React, { useState } from "react";
import { Container } from "react-bootstrap";
import '../pagescss/auth.css';
import { IoEye, IoEyeOff } from "react-icons/io5";
import { Link, useNavigate } from "react-router-dom";
import apiClient from "../api/client";
import { useAuth } from "../auth/AuthContext";
import { PageHeader, ErrorBanner } from "../components/ui";

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    const navigate = useNavigate();
    const { login } = useAuth();

    const handleLoginUser = async (event) => {
        event.preventDefault();
        setError('');

        if (!email || !password) {
            setError("Please fill in all fields");
            return;
        }

        setIsLoading(true);

        try {
            const response = await apiClient.post('/users/login', {
                email, password
            });

            if (response.status === 200) {
                const { token, userRole } = response.data.data;

                // Fetch userID
                const userIdResponse = await apiClient.get(`/users/${email}`);
                const userID = userIdResponse.data.data;

                // Use AuthContext login
                login({ token, userRole, userID });

                if (userRole === 'ADMIN') {
                    navigate('/admin/dashboard');
                } else {
                    navigate('/');
                }
            }
        } catch (error) {
            if (error.response?.status === 401) {
                setError("Incorrect email or password. Please try again.");
            } else if (error.response?.status === 404) {
                setError("No account found with this email address.");
            } else {
                setError("Unable to login. Please try again later.");
            }
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="auth-page">
            <div className="auth-wrapper">
                <Container className="auth-container">
                    <PageHeader 
                        title="Welcome Back" 
                        subtitle="Sign in to continue to your account"
                        showBack 
                    />
                    
                    {error && (
                        <ErrorBanner 
                            message={error} 
                            onDismiss={() => setError('')} 
                        />
                    )}

                    <form className="auth-form" onSubmit={handleLoginUser}>
                        <div className="form-group">
                            <label htmlFor="email" className="form-label">Email</label>
                            <input
                                type="email"
                                id="email"
                                className="form-input"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="Enter your email"
                                disabled={isLoading}
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="password" className="form-label">Password</label>
                            <div className="password-input-wrapper">
                                <input
                                    type={showPassword ? "text" : "password"}
                                    id="password"
                                    className="form-input"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="Enter your password"
                                    disabled={isLoading}
                                    required
                                />
                                <button
                                    type="button"
                                    className="password-toggle"
                                    onClick={() => setShowPassword(!showPassword)}
                                    aria-label={showPassword ? "Hide password" : "Show password"}
                                >
                                    {showPassword ? <IoEyeOff size={20} /> : <IoEye size={20} />}
                                </button>
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
                                    <span>Signing in...</span>
                                </>
                            ) : (
                                'Sign In'
                            )}
                        </button>

                        <div className="auth-footer">
                            <span>Don't have an account?</span>
                            <Link to="/register" className="auth-link">
                                Create Account
                            </Link>
                        </div>
                    </form>
                </Container>
            </div>
        </div>
    );
};

export default Login;
