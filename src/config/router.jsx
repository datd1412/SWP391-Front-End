import { Navigate, Outlet, createBrowserRouter } from "react-router-dom";

import ManagerPage from "../page/manager/ManagerPage";
import LoginPage from "../page/login/LoginPage";
import RegisterPage from "../page/register/RegisterPage";
import HomePage from "../page/home/HomePage";
import ErrorPage from "../page/error/ErrorPage";
import ManageFarm from "../page/manager/manage-farm/managefarm";
import Layout from "../components/layout/layout"
import ManageKoi from "../page/manager/manage-koi/managekoi";
import ManageTour from "../page/manager/manage-tour/managetour";
import BookingApproval from "../page/manager/manage-booking/managebooking";
import ProfilePage from "../page/profile/ProfilePage";
import BookingPage from "../page/booking/BookingPage";
import TestSearch from "../components/SearchBar/TestSearch";
import SuccessPage from "../page/result/SuccessPage";
import KoiFishPage from "../page/koifish/KoiFishPage";
import KoiFarmPage from "../page/koifarm/KoiFarmPage";
import TourDetailPage from "../page/tourdetail/TourDetailPage";
import TourPage from "../page/tour/TourPage";
import FaillPage from "../page/result/FaillPage";
import PrivateRoute from "./routers/PrivateRoute";
import BookingProcess from "../page/manager/manage-booking/bookingProcess";
import BookingManagement from "../page/manager/manage-booking/BookingManagement";
import Dashboard from "../page/manager/Dashboard/dashboard";
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
      {
        path: "/profile",
        element: <ProfilePage />,
      },
      {
        path: "/bookingtour",
        element: <BookingPage />,
      },
      {
        path: "/success",
        element: <SuccessPage />,
      },
      {
        path: "/failPayment",
        element: <FaillPage />
      },
      {
        path: "/tour",
        element: <TourPage />,
      },
      {
        path: "/tourdetail/:id",
        element: <TourDetailPage />,
      },
      {
        path: "/koifarm",
        element: <KoiFarmPage />,
      },
      {
        path: "/koifish",
        element: <KoiFishPage />,
      },
      {
        path: "/test",
        element: <TestSearch />
      }
    ]
  },
  {
    path: "/register",
    element: <RegisterPage />,
  },
  {
    path: "/login",
    element: <LoginPage />,
  },
  {
    path: "/manager",
    element: (
      <PrivateRoute allowedRoles={['ADMIN', 'STAFF', 'CONSULTANT_STAFF']}>
        <ManagerPage />
      </PrivateRoute>
    ),
    children: [
      {
        path: "ManageFarm",
        element: (
          <PrivateRoute allowedRoles={['ADMIN']}>
            <ManageFarm />
          </PrivateRoute>
        ),
      },
      {
        path: "ManageKoi",
        element: (
          <PrivateRoute allowedRoles={['ADMIN']}>
            <ManageKoi />
          </PrivateRoute>
        ),
      },
      {
        path: "ManageTour",
        element: (
          <PrivateRoute allowedRoles={['ADMIN']}>
            <ManageTour />
          </PrivateRoute>
        ),
      },
      {
        path: "BookingApproval",
        element: (
          <PrivateRoute allowedRoles={['ADMIN']}>
            <BookingApproval />
          </PrivateRoute>
        ),
      },
      {
        path: "BookingProcess",
        element: (
          <PrivateRoute allowedRoles={['STAFF']}>
            <BookingProcess />
          </PrivateRoute>
        ),
      },
      {
        path: "BookingManagement",
        element: (
          <PrivateRoute allowedRoles={['CONSULTANT_STAFF']}>
            <BookingManagement />
          </PrivateRoute>
        ),
      },
      {
        path: "Dashboard",
        element: (
          <PrivateRoute allowedRoles={['ADMIN', 'STAFF', 'CONSULTANT_STAFF']}>
            <Dashboard />
          </PrivateRoute>
        ),
      },
      {
        path: "",
        element: <Navigate to="/manager/Dashboard" replace />,
      },
    ],
  },
]);