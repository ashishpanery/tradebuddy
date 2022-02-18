export const setCurrentUser = user => ({
    type: 'SET_CURRENT_USER',
    payload: user,
})

export const removeUser = () => ({
    type: 'REMOVE_USER',
})

export const updatePhoto = (photo) => ({
    type: 'UPDATE_PROFILE_PIC',
    payload: photo
})

export const joinCallDetails = callDetails => ({
    type: 'JOIN_CALL',
    payload: callDetails,
})

export const disconnectCall = () => ({
    type: 'DISCONNECT_CALL'
})
