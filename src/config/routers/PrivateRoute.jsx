import React from 'react';
import { useSelector } from 'react-redux';
import { Navigate } from 'react-router-dom';
import ErrorPage from '../../page/error/ErrorPage';

const PrivateRoute = ({ children, allowedRoles }) => {
  const user = useSelector((state) => state.user);

  if (user && allowedRoles.includes(user.role)) {
    return children;
  }

  return <Navigate to="/403" />;
};

export default PrivateRoute;
