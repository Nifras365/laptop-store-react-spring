import React from "react";
import { Container } from "react-bootstrap";
import '../pagescss/login.css'

const Login = () =>{
    return(
    <div>
        <h1>Login Page</h1>
            <Container className="login-container">
                <form className="login-form">
                    <div>
                        <label>Email</label>
                        <input/>
                    </div>
                    <div>
                        <label>Password</label>
                        <input/>
                    </div>
                    <div>
                        <button>Login</button>
                    </div>
                </form>
            </Container>
        </div>
    );
}

export default Login;