import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../auth/AuthContext";

const ProtectedAdminRoute = ({children}) => {
    const { isAuthenticated, hasRole } = useAuth();

    if(isAuthenticated && hasRole('ADMIN')){
        return children;
    }
    else{
        return <Navigate to="/login"/>
    }
};

export default ProtectedAdminRoute;