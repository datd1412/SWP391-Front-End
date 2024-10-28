const initialState = {
    bookings: [],
}

function bookingsReducer(state = initialState, action) {
    switch (action.type) {
        case 'ADD_BOOKING':
            return { bookings: [...state.bookings, action.payload] };
        case 'SET_BOOKINGS':
            return { bookings: action.payload };
        default:
            return state;
    }
}

export default bookingsReducer;