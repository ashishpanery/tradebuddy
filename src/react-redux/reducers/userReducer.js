const userDetails = {
    currentUser: null,
}
export const userReducer = (state = userDetails, action) => {
    switch (action.type) {
        case 'SET_CURRENT_USER':
            return {
                ...state,
                currentUser: action.payload
            }
        case 'REMOVE_USER':
            return {
                ...state,
                currentUser: null,
            }
        case 'UPDATE_PROFILE_PIC':
            return {
                ...state,
                currentUser: {
                    ...state.currentUser,
                    data: {
                        ...state.currentUser.data,
                        photoUrl: action.payload
                    }
                }
            }
        default:
            return state
    }
}