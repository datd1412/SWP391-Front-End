import React, { useEffect, useState } from 'react'
import { Outlet } from 'react-router-dom'
import Footer from '../footer/Footer'
import Header from '../header/Header'


function Layout() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      const account = JSON.parse(localStorage.getItem("user"));
      console.log(account.data.role);
      if (account) {
        setUser(account);
      }
    }
  }, [])

  return (
    <>
      <Header user={user} setUser={setUser} />
      <Outlet />
      <Footer />
    </>
  )
}

export default Layout