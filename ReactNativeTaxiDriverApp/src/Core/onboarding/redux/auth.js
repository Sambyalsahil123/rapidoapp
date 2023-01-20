const UPDATE_USER = 'UPDATE_USER'
const LOG_OUT = 'LOG_OUT'
const SET_ACTIVE = 'SET_ACTIVE';

export const DUMMY_USER_DATA = {}

export const setUserData = data => ({
  type: UPDATE_USER,
  data,
})

export const setActive = () => ({
  type: SET_ACTIVE,
})


export const logout = () => ({
  type: LOG_OUT,
})

const initialState = {
  user: DUMMY_USER_DATA,
}

export const auth = (state = initialState, action) => {
  switch (action.type) {
    case UPDATE_USER:
      return {
        ...state,
        user: action.data.user,
      }
    case SET_ACTIVE:
      let user = state.user
      user.isActive = true
      return {
        ...state,
        user,
      }
    case LOG_OUT: {
      return initialState
    }
    default:
      return state
  }
}
