import React from "react";
import { useSelector, useDispatch } from "react-redux";

import { Redirect, Link } from "react-router-dom";

import Top_nav from "./home_sub/top_nav";

export default () => {
  const auth_state = localStorage.getItem("auth-token");

  if (auth_state) {
    return (
      <React.Fragment>
        <Top_nav />
        <p>home</p>
      </React.Fragment>
    );
  } else {
    return <Redirect to="/" />;
  }
};
