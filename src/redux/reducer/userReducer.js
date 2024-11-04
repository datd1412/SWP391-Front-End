const initialState = {
    fullName: '',
    username: '',
    address: '',
    email: '',
    role: '',
}

function userReducer(state = initialState, action) {
    switch (action.type) {
        case 'LOG_IN':
            return { ...state, ...action.payload ,};
        case 'LOG_OUT':
            return initialState;
        default:
            return state;
    }
}

export default userReducer;