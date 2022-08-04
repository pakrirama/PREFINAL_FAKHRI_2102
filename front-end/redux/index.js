import { combineReducers } from "@reduxjs/toolkit";
import authReducer from "./reducer/authReducer";
import renderReducer from "./reducer/renderReducer";
import newPostReducer from "./reducer/newPostReducer";
import captionReducer from "./reducer/captionReducer";

const rootReducer = combineReducers({
  authReducer,
  renderReducer,
  newPostReducer,
  captionReducer,
});

export default rootReducer;
