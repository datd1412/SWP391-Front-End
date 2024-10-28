export const addBooking = (booking) => ({
    type: 'ADD_BOOKING',
    payload: booking,
});

export const setBookings = (bookings) => ({
    type: 'SET_BOOKINGS',
    payload: bookings,
});