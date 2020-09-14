import { combineReducers } from "redux";

import auth from "./auth";

const root = combineReducers({
  auth,
});
export default root;
