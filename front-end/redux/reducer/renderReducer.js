const initialState = {
  value: false,
  setting: false,
};

// const fetchTrigger = (initialPostState.value)

const renderReducer = (state = initialState, action) => {
  if (action.type === "FETCH_DATA") {
    return {
      ...state,
      value: action.payload.value,
      setting: action.payload.setting,
      // value: true,
    };
  }
  return state;
};

export default renderReducer;
