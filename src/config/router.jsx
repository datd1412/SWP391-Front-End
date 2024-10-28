import { Navigate, Outlet, createBrowserRouter } from "react-router-dom";

import ManagerPage from "../page/manager/ManagerPage";
import LoginPage from "../page/login/LoginPage";
import RegisterPage from "../page/register/RegisterPage";
import HomePage from "../page/home/HomePage";
import ErrorPage from "../page/error/ErrorPage";
import Header from "../components/header/Header";
import Footer from '../components/footer/Footer';
import ManageFarm from "../page/manager/manage-farm/managefarm";
import Layout from "../components/layout/layout"
import ManageKoi from "../page/manager/manage-koi/managekoi";
import ManageTour from "../page/manager/manage-tour/managetour";
import BookingApproval from "../page/manager/manage-booking/managebooking";
import BookingProcess from "../page/manager/manage-booking/bookingProcess";
import Dashboard from "../page/manager/Dashboard/dashboard";
import BookingManagement from "../page/manager/manage-booking/BookingManagement";
// import ManageTour from "../page/manager/manage-tour/managetour"
// const ProtectedRouteAuth = ({ children }) => {
//   const user = useSelector(selectUser);
//   if (!user) {
//     alertFail("You need to login first!!");
//     return <Navigate to="/login" replace />;
//   }
//   return children;
// };

// const ProtectedRouteCreator = ({ children }) => {
//   const user = useSelector(selectUser);
//   console.log(user);
//   if (user?.role === "AUDIENCE") {
//     alertFail("You do not have permissions to access");
//     return <Navigate to="/go-pro" replace />;
//   }
//   return children;
// };

// const ProtectedADMIN = ({ children }) => {
//   const user = useSelector(selectUser);
//   console.log(user);
//   if (user?.role !== "ADMIN") {
//     if (u  ser?.role !== "MOD") {
//       alertFail("You do not have permissions to access");
//       return <Navigate to="/" replace />;
//     }
//   }
//   return children;
// };

export const router = createBrowserRouter([
  {
    path: "*",
    element: <ErrorPage />,
  },
  {
    path: "/",
    element: (
      <Layout />
    ),
    children: [
      {
        path: "/",
        element: <HomePage />,
      },
    ]
  },
  {
    path: "/register",
    element: <RegisterPage />,
  },
  {
    path:"/login",
    element: <LoginPage/>,
  },
  {
    path: "/manager",
    element: <ManagerPage />, // ManagerPage sẽ render các trang con
    children: [
      {
        path: "ManageFarm", // URL /manager/page1
        element: <ManageFarm />, // Trang Page1
      },
      {
        path:"ManageKoi",
        element: <ManageKoi />
      },
      {
         path:"ManageTour",
         element: <ManageTour />
      },
      {
        path:"ManageBooking",
        element:<BookingApproval />
     },
     {
      path:"BookingProcess",
      element:<BookingProcess />
     },
     
     {
       path:"Dashboard",
       element: <Dashboard/> 
     },
     {
       path:"BookingManagement",
       element: <BookingManagement/>
     },
      {
        path: "", // Route con mặc định
        element: <Navigate to="/manager/ManageFarm" replace />, // Chuyển hướng về ManageKoi
      },
    ]

  }
]); 
