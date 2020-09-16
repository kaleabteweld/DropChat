import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import log_in_ac from "../redux/action/log_in";

import { Redirect, Link } from "react-router-dom";
import { BrowserRouter, Route } from "react-router-dom";

import axios from "axios";

import Loader from "./home_sub/loader";

import Top_nav from "./home_sub/top_nav";
import Group from "./home_sub/group";
import Post from "./home_sub/post";
import Bottom_nav from "./home_sub/bottom_nav";

export default () => {
  const dispatch = useDispatch();
  const auth_token = localStorage.getItem("auth-token");
  const auth_state = useSelector((state) => state.auth);
  const were_state = useSelector((state) => state.were_now);

  const [done, setdone] = useState(false);

  useEffect(() => {
    // get user data
    if (!auth_state.log_in) {
      axios
        .get("http://localhost:4000/api/users/me", {
          headers: { "x-auth-token": auth_token },
        })
        .then(function (response) {
          dispatch(
            log_in_ac({
              data: response.data,
              token: localStorage.getItem("auth-token"),
            })
          );
          setdone(true);
        })
        .catch((err) => {
          console.log(err);
        });
    }
  });

  const data_view = {
    group: <Group />,
    post: <Post />,
  };

  console.log(were_state);
  if (auth_token) {
    if (done) {
      return (
        <React.Fragment>
          <Top_nav />
          {data_view[were_state.loc]}
          <Bottom_nav />
        </React.Fragment>
      );
    } else {
      return <Loader />;
    }
  } else {
    return <Redirect to="/" />;
  }
};
