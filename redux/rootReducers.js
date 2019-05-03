import { combineReducers } from "redux";
import authReducers from "./reducers/authReducers";
import uploadReducers from "./reducers/uploadReducers";

export default combineReducers({
  authReducers,
  uploadReducers
});
