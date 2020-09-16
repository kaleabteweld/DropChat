import { combineReducers } from "redux";

import auth from "./auth";
import were_now from "./were_now";

const root = combineReducers({
  auth,
  were_now,
});
export default root;
