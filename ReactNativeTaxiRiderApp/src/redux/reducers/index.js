import { combineReducers } from 'redux'
import { auth } from '../../Core/onboarding/redux/auth'
import { bottomSheet } from './bottomSheet'
import { payment } from './payment'
import { ride } from './ride'
import { trip } from './trip'

const LOG_OUT = 'logout'

// combine reducers to build the state
const appReducer = combineReducers({
  auth,
  bottomSheet,
  payment,
  ride,
  trip,
})

const rootReducer = (state, action) => {
  if (action.type === LOG_OUT) {
    state = undefined
  }

  return appReducer(state, action)
}

export default rootReducer
