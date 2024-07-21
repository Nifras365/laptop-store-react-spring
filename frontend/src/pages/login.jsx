import React from "react";
import { Container } from "react-bootstrap";
import '../pagescss/login.css';

const Login = () => {
    return (
        <div className="login-wrapper">
            <Container className="login-container">
                <h1>Login</h1>
                <form className="login-form">
                    <div className="form-group">
                        <label>Email</label>
                        <input type="email" id="email" className="form-control" placeholder="Enter your email" required />
                    </div>
                    <div className="form-group">
                        <label>Password</label>
                        <input type="password" id="password" className="form-control" placeholder="Enter your password" required />
                    </div>
                    <div className="form-button">
                        <button type="submit" className="btn btn-primary">Login</button>
                    </div>
                </form>
            </Container>
        </div>
    );
}

export default Login;
