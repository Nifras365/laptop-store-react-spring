import React from "react";
import { Navigate } from "react-router-dom";

const ProtectedAdminRoute = ({children}) => {
    const role = localStorage.getItem('userRole');
    const token = localStorage.getItem('token');

    if(role === 'ADMIN' && token){
              
        return children;
    }
    else{
        return <Navigate to="/login"/>
    }
};

export default ProtectedAdminRoute;