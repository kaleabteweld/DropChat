import React, { useState, useRef, useEffect } from "react";

import axios from "axios";

import { useSelector, useDispatch } from "react-redux";
import log_in_ac from "../../redux/action/log_in";

import "../css/home_sud/top_nav.css";

var Top_nav = () => {
  const auth_token = localStorage.getItem("auth-token");
  const auth_state = useSelector((state) => state.auth);

  const dispatch = useDispatch();

  const [user_img, setuser_img] = useState(
    require("../../img/icon/user-192.png")
  );

  useEffect(() => {
    if (auth_state.user_data.img) {
      console.log("re");
      setuser_img(auth_state.user_data.img);
    }
  });

  console.log("user_img: ", user_img);

  return (
    <nav id="nav" className="navbar  navbar-dark bg-dark">
      <a className="navbar-brand" href="#">
        DropTalk
      </a>

      <a id="find" href=" ">
        <img
          src={require("../../img/icon/Search-10.png")}
          width="30"
          height="30"
          className="d-inline-block align-top"
          style={{ borderRadius: "50%" }}
        ></img>
        <p> Search </p>
      </a>

      <a className="sub" href=" ">
        <img
          src={user_img}
          width="30"
          height="30"
          className="d-inline-block align-top"
          style={{ borderRadius: "50%" }}
        ></img>
      </a>

      <a className="sub" href="../DropTalk/settings.php">
        <img
          src={require("../../img/icon/settings_250x250_0096d6.png")}
          width="30"
          height="30"
        ></img>
      </a>
    </nav>
  );
};

export default Top_nav;
