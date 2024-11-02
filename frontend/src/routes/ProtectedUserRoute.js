import React from "react";
import { Navigate } from "react-router-dom";

const ProtectedUserRoute = ({children}) => {
    const role = localStorage.getItem('userRole');
    const token = localStorage.getItem('token');

    if(role === 'USER' && token){
        return children;
    }
    else{
        return <Navigate to="/login"/>
    }
};

export default ProtectedUserRoute;