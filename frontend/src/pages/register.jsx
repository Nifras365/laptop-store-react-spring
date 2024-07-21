import React from "react";
import '../pagescss/register.css'
import { Container } from "react-bootstrap";
import { IoArrowBack } from "react-icons/io5";

const Register = () => {

    const GoBack =()=>{
        window.history.back()
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
        </div>
    );
}

export default Register;