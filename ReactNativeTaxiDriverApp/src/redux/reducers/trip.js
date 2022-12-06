const LOG_OUT = 'logout';
const SET_ORIGIN = 'SET_ORIGIN';
const SET_DESTINATION = 'SET_DESTINATION';
const SET_JOB_DESCRIPTION = 'SET_JOB_DESCRIPTION';
const SET_JOB_COORDINATES = 'SET_JOB_COORDINATES';
const SET_DROP_OFF_ETA = 'SET_DROP_OFF_ETA';
const SET_DROP_OFF_DISTANCE = 'SET_DROP_OFF_DISTANCE';
const SELECTED_RIDE = 'SELECTED_RIDE';
const SELECTED_RIDE_PRICE_RANGE = 'SELECTED_RIDE_PRICE_RANGE';
const RESET_TRIP_STATE = 'RESET_TRIP_STATE';

export const setSelectedRide = (data) => ({
  type: SELECTED_RIDE,
  data,
});

export const setSelectedRidePriceRange = (data) => ({
  type: SELECTED_RIDE_PRICE_RANGE,
  data,
});

export const setOrigin = (data) => ({
  type: SET_ORIGIN,
  data,
});

export const setDestination = (data) => ({
  type: SET_DESTINATION,
  data,
});

export const setDropoffETA = (data) => ({
  type: SET_DROP_OFF_ETA,
  data,
});

export const setDropoffDistance = (data) => ({
  type: SET_DROP_OFF_DISTANCE,
  data,
});

export const setTripDescription = (data) => ({
  type: SET_JOB_DESCRIPTION,
  data,
});

export const setTripCoordinates = (data) => ({
  type: SET_JOB_COORDINATES,
  data,
});

export const resetTripState = (data) => ({
  type: RESET_TRIP_STATE,
  data,
});

const initialState = {
  dropoffETA: '',
  dropoffDistance: '',
  ride: {},
  origin: {
    latitude: 0,
    longitude: 0,
    latitudeDelta: 0.0143,
    longitudeDelta: 0.0134,
    location: null,
    title: null,
  },
  destination: null,
  tripDescription: {},
  tripCoordinates: {
    pickup: null,
    carDrive: null,
    dropoff: null,
    routeCoordinates: null,
    routeId: null,
  },
  priceRange: '',
};

export const trip = (state = initialState, action) => {
  switch (action.type) {
    case SET_ORIGIN:
      return {
        ...state,
        origin: {
          ...state.origin,
          ...action.data,
        },
      };
    case SET_DESTINATION:
      return {
        ...state,
        destination: action.data,
      };
    case SET_JOB_DESCRIPTION:
      return {
        ...state,
        tripDescription: { ...state.tripDescription, ...action.data },
      };
    case SET_JOB_COORDINATES:
      return {
        ...state,
        tripCoordinates: { ...state.tripCoordinates, ...action.data },
      };
    case SELECTED_RIDE:
      return {
        ...state,
        ride: action.data,
      };
    case SELECTED_RIDE_PRICE_RANGE:
      return {
        ...state,
        priceRange: action.data,
      };
    case SET_DROP_OFF_ETA:
      return {
        ...state,
        dropoffETA: action.data,
      };
    case SET_DROP_OFF_DISTANCE:
      return {
        ...state,
        dropoffDistance: action.data,
      };
    case RESET_TRIP_STATE:
      return initialState;
    case LOG_OUT:
      return initialState;
    default:
      return state;
  }
};
