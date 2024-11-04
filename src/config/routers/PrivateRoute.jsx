import React from 'react'
import { useSelector } from 'react-redux'
import ErrorPage from '../../page/error/ErrorPage';
import { Outlet } from 'react-router-dom';
import HomePage from '../../page/home/HomePage';

function PrivateRoute({ children }) {
  const user = useSelector((state) => state.user);

  if (user && user.role === "ADMIN") return children;

  return (
    <ErrorPage/>
  );
}

export default PrivateRoute;