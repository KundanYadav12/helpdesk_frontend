 
import React from 'react';
import { Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

const PrivateRoute = ({ children, allowedRoles }) => {
  const { user, role } = useSelector((state) => state.auth); // ✅ Get role too

  // If not logged in, redirect to login
  if (!user) return <Navigate to="/login" replace />;

  // If allowedRoles is defined, check if user's role is in the allowed list
  if (allowedRoles && !allowedRoles.includes(role)) {
    return <Navigate to="/unauthorized" replace />;
  }

  return children;
};

export default PrivateRoute;
