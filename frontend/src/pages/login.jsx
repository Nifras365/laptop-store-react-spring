import React from "react";
import { Container } from "react-bootstrap";

const Login = () =>{
    return(
    <div>
        <h1>Login Page</h1>
            <Container>
                <form>
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