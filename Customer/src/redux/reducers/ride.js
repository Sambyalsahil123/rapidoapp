const LOG_OUT = 'logout';
const SET_CARS = 'SET_CARS';
const SET_CAR_CATEGORIES = 'SET_CAR_CATEGORIES';

export const setCars = (data) => ({
  type: SET_CARS,
  data,
});

export const setCarCategories = (data) => ({
  type: SET_CAR_CATEGORIES,
  data,
});

const initialState = {
  cars: [],
  carCategories: [],
};

export const ride = (state = initialState, action) => {
  switch (action.type) {
    case SET_CARS:
      return {
        ...state,
        cars: action.data,
      };
    case SET_CAR_CATEGORIES:
      return {
        ...state,
        carCategories: action.data,
      };

    case LOG_OUT:
      return initialState;
    default:
      return state;
  }
};
