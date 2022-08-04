const initialState = {
  value: {},
};

const captionReducer = (state = initialState, action) => {
  if (action.type === "SET_CAPTION") {
    return {
      ...state,
      value: action.payload.value,
    };
  }
  return state;
};

export default captionReducer;
