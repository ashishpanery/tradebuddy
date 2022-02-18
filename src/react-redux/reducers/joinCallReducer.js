const callDetails = {
    details: null,
}

export const joinCallReducer = (state = callDetails, action) => {
    switch (action.type) {
        case 'JOIN_CALL':
            return {
                ...state,
                details: action.payload
            }
        case 'DISCONNECT_CALL':
            return {
                ...state,
                details: null
            }
        default:
            return state
    }
}