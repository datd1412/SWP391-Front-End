import { combineReducers } from "@reduxjs/toolkit";
import counterSlice from "./counterSlice";
import bookingsReducer from "./bookingReducer";
import userReducer from './userReducer';

const rootReducer = combineReducers({
  user: userReducer,
  bookings: bookingsReducer,
});

export default rootReducer;