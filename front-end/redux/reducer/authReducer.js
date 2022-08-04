const initialState = {
  id: "",
  name: "",
  username: "",
  email: "",
  avatar: "",
  bio: "",
  is_verified: false,
};

const authReducer = (state = initialState, action) => {
  if (action.type === "AUTH_LOGIN") {
    return {
      ...state,
      id: action.payload.id,
      username: action.payload.username,
      email: action.payload.email,
      name: action.payload.name,
      avatar: action.payload.avatar,
      bio: action.payload.bio,
      is_verified: action.payload.is_verified,
    };
  }

  if (action.type === "AUTH_LOGOUT") {
    return initialState;
  }

  return state;
};

export default authReducer;
