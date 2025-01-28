import React from "react";
import { Container } from "react-bootstrap";
import '../pagescss/login.css';
import { IoArrowBack } from "react-icons/io5";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

const Login = () => {

    const[email, setEmail] = useState('');
    const[password, setPassword] = useState('');

    const navigate = useNavigate();

    const handleLoginUser = async(event) => {
        event.preventDefault(); 
        try{
            if(!email || !password){
                console.error("Fill all fields !!!");
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

                const {token, userRole} = data.data;

                localStorage.setItem('userRole', userRole === 'Optional[ADMIN]' ? 'ROLE_ADMIN' : 'ROLE_USER');
                
                localStorage.setItem('token', token);

                const userIdResponse = await fetch(`http://localhost:8080/users/${email}`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                });

                if(userIdResponse.ok){
                    const userIdData = await userIdResponse.json();
                    const userID = userIdData.data;
                    localStorage.setItem('userID', userID);
                } else{
                    console.error("Failed to fetch userID: ", userIdResponse.status, userIdResponse.statusText);
                }

                console.log("Login successful !!!");

                if(userRole === 'Optional[ADMIN]'){
                    navigate('/admin/dashboard');
                }
                else{
                    navigate('/');
                }
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
        <div className="login-page">
            <button
                type="button"
                className="back-button"
                onClick={GoBack}
            >
                <IoArrowBack size={25} />
            </button>
            <div className="login-wrapper">
                <Container className="login-container">
                    <h1>Login</h1>
                    <form className="login-form" onSubmit={handleLoginUser}>
                        <div className="form-group">
                            <label htmlFor="email">Email</label>
                            <input
                                type="email"
                                id="email"
                                className="form-control"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="Enter your email"
                                required
                            />
                        </div>
                        <div className="form-group">
                            <label htmlFor="password">Password</label>
                            <input
                                type="password"
                                id="password"
                                className="form-control"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="Enter your password"
                                required
                            />
                        </div>
                        <div className="form-button">
                            <button type="submit" className="btn btn-primary">
                                Login
                            </button>
                        </div>
                        <div className="signup-link">
                            <Link to="/register">
                                {"Don't have an account? Sign Up"}
                            </Link>
                        </div>
                    </form>
                </Container>
            </div>
        </div>
    );
}

export default Login;
