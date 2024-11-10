import React from 'react'
import { useSelector } from 'react-redux'
import ErrorPage from '../../page/error/ErrorPage';

function ProtectedRoute({ children }) {
  const user = useSelector((state) => state.user);

  if (user && user.role === "ADMIN"  || user.role === "STAFF" || user.role === "CONSULTANT_STAFF") return children;

  return (
    <ErrorPage/>
  );
}

export default ProtectedRoute;