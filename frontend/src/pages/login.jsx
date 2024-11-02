import React from "react";
import { Container } from "react-bootstrap";
import '../pagescss/login.css';
import { IoArrowBack } from "react-icons/io5";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

const Login = () => {

    const[email, setEmail] = useState('');
    const[password, setPassword] = useState('');

    const navigate = useNavigate();

    const handleLoginUser = async(event) => {
        event.preventDefault(); 
        try{
            if(!email || !password){
                console.error("Fill all fields!!");
                return;
            }
            const response = await fetch('http://localhost:8080/users/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    email, password
                }),
            });
            if(response.ok){
                const data = await response.json();

                console.log("API Response: ", data.data); 

                const {token, role} = data.data;

                if (role === "ADMIN") {
                    localStorage.setItem('userRole', 'ADMIN');
                    localStorage.setItem('token', token);
                } else{
                    localStorage.setItem('userRole', 'USER');
                    localStorage.setItem('token', token);
                }

                console.log("Login successful !!!");
                navigate('/');
            }
            else{
                console.error("Failed to login : ", response.status, response.statusText);
            }
        }
        catch(error){
            console.error("Error Ocuured : ", error.message);
        }
    }

    const GoBack= () =>{
        window.history.back()
    }

    return (
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
                <form className="login-form" onSubmit={handleLoginUser}>
                    <div className="form-group">
                        <label>Email</label>
                        <input type="email" id="email" className="form-control" 
                                value={email}
                                onChange={(e)=>setEmail(e.target.value)}
                                placeholder="Enter your email" required />
                    </div>
                    <div className="form-group">
                        <label>Password</label>
                        <input type="password" id="password" className="form-control" 
                                value={password}
                                onChange={(e)=>setPassword(e.target.value)}
                                placeholder="Enter your password" required />
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

export default Login;
