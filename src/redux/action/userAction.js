export const setUser = (user) => ({
    type: 'LOG_IN',
    payload: user,
});

export const clearUser = () => ({
    type: 'LOG_OUT',
});