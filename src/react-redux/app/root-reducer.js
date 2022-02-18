import { combineReducers } from 'redux'
import { joinCallReducer } from '../reducers/joinCallReducer'
import { userReducer } from '../reducers/userReducer'

export default combineReducers({
    user: userReducer,
    joinCall: joinCallReducer
})