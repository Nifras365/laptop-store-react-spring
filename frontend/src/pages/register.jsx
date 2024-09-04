import React from "react";
import '../pagescss/register.css'
import { Container } from "react-bootstrap";
import { IoArrowBack } from "react-icons/io5";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

const Register = () => {

    const[name, setName] = useState('');
    const[email, setEmail] = useState('');
    const[phone, setPhone] = useState('');
    const[country, setCountry] = useState('');
    const[address, setAddress] = useState('');
    const[password, setPassword] = useState('');
    const[confirmPassword, setConfirmPassword] = useState('');

    const GoBack = () => {
        window.history.back();
    }

    return(
        <div>
            <button
                type="button"
                className="btn btn-light mb-4"
                onClick={GoBack}
                style={{
                        position: 'absolute',
                        top: '20px',
                        left: '20px',
                        zIndex: 1000,
                        border: 'none',
                        background: 'none'
                      }}
            >
                <IoArrowBack size={25}/>
            </button>
        <div className="register-wrapper">
            <Container className="register-container">
                <h1>Register</h1>
                <form className="register-form">
                    <div className="form-group">
                        <label>Name</label>
                        <input type="text" id="name" className="form-control" placeholder="Enter your name" required />
                    </div>
                    <div className="form-group">
                        <label>Email</label>
                        <input type="email" id="email" className="form-control" placeholder="Enter your email" required />
                    </div>
                    <div className="form-group">
                        <label>Phone</label>
                        <input type="text" id="phone" className="form-control" placeholder="Enter your phone number" required />
                    </div>
                    <div className="form-group">
                        <label>Country</label>
                        <input type="text" id="country" className="form-control" placeholder="Enter your country" required />
                    </div>
                    <div className="form-group">
                        <label>Address</label>
                        <input type="text" id="address" className="form-control" placeholder="Enter your current address" required />
                    </div>
                    <div className="form-group">
                        <label>Password</label>
                        <input type="password" id="password" className="form-control" placeholder="Enter your password" required />
                    </div>
                    <div className="form-group">
                        <label>Confirm Password</label>
                        <input type="password" id="password" className="form-control" placeholder="Enter your password" required />
                    </div>
                    <div className="form-button">
                        <button type="submit" className="btn btn-primary">Register</button>
                    </div>
                </form>
            </Container>
        </div>
        </div>
    );
}

export default Register;