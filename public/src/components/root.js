import React from "react";
import { useSelector, useDispatch } from "react-redux";

import log_in from "../redux/action/log_in";
import log_out from "../redux/action/log_out";

import Into from "./into";
import Home from "./home";

export default () => {
  // const auth_state = useSelector((state) => state.auth);
  // const dispatch = useDispatch();

  const auth_state = localStorage.getItem("auth-token");

  if (auth_state) {
    return <Home />;
  } else {
    return <Into />;
  }
};
