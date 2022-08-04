const initialState = {
  value: {},
  deletePost: null,
};

const newPostReducer = (state = initialState, action) => {
  if (action.type === "SET_POST") {
    return {
      ...state,
      value: action.payload.value,
    };
  }
  if (action.type === "UNSET_POST") {
    return initialState;
  }
  if (action.type === "DELETE_POST") {
    return {
      ...state,
      deletePost: action.payload.deletePost,
    };
  }
  return state;
};

export default newPostReducer;
