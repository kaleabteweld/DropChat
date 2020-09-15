import React from "react";

import "../css/home_sud/top_nav.css";

var top_nav = () => {
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
          style={{ "border-radius": "50%;" }}
        ></img>
        <p> Search </p>
      </a>

      <a className="navbar-brand" href=" ">
        <img
          src=""
          width="30"
          height="30"
          className="d-inline-block align-top"
          style={{ "border-radius": "50%;" }}
        ></img>
      </a>

      <a className="navbar-brand" href="../DropTalk/settings.php">
        <img
          src={require("../../img/icon/security_network_250x250_0096d6.png")}
          width="30"
          height="30"
        ></img>
      </a>
    </nav>
  );
};

export default top_nav;
