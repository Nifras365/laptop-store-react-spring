import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../auth/AuthContext";

const ProtectedUserRoute = ({children}) => {
    const { isAuthenticated, hasRole } = useAuth();

    if(isAuthenticated && hasRole('USER')){
        return children;
    }
    else{
        return <Navigate to="/login"/>
    }
};

export default ProtectedUserRoute;