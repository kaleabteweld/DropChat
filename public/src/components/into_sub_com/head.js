import React from "react";

import { Link, NavLink } from "react-router-dom";

import "../css/into_sub_com/head.css";
export default () => {
  return (
    <div id="head">
      <div id="main" className="container-fluid">
        <p id="title">
          DropChat <br></br>
          Connect To Whone Matter
        </p>

        <div id="ch">
          <Link type="button" to="/logIn" className="btn btn-primary">
            Log In
          </Link>
          <Link type="button" to="/signIn" className="btn btn-primary">
            Sign In
          </Link>
        </div>
      </div>
    </div>
  );
};
