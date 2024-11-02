import React from 'react'
import { useSelector } from 'react-redux'
import ErrorPage from '../../page/error/ErrorPage';

function ProtectedRoute({ role, children }) {

    const user = useSelector((state) => state.user);

    if (user && user.role === role) {
        return children;
    }

  return (
    <div><ErrorPage /></div>
  )
}

export default ProtectedRoute