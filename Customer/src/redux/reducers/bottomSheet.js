const LOG_OUT = 'logout';
const BOTTOM_SHEET_SNAP_POINTS = 'BOTTOM_SHEET_SNAP_POINTS';

export const setbottomSheetSnapPoints = (data) => ({
  type: BOTTOM_SHEET_SNAP_POINTS,
  data,
});

const initialState = {
  bottomSheetSnapPoints: { key: 'home_search', snapPoints: [1, 2], index: 1 },
};

export const bottomSheet = (state = initialState, action) => {
  switch (action.type) {
    case BOTTOM_SHEET_SNAP_POINTS:
      return {
        ...state,
        bottomSheetSnapPoints: action.data,
      };

    case LOG_OUT:
      return initialState;
    default:
      return state;
  }
};
