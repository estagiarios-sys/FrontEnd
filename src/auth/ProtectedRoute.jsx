import Cookies from 'js-cookie';
import React from 'react';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children }) => {
  const token = Cookies.get('token');
  return token ? children : <Navigate to="/reports/login" />;
};

export default ProtectedRoute;