import React from "react";

import "../css/into_sub_com/portes.css";

export default () => {
  return (
    <div id="portes" className="container-fluid">
      <div className="box">
        <img
          src={require("../../img/icon/security_network_250x250_0096d6.png")}
          alt=""
          id="ico"
        ></img>

        <h1 id="title"> security network </h1>

        <p id="text">
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Esse numquam
          aliquam, maxime sint itaque eaque ea
        </p>
      </div>
      <div className="box">
        <img
          src={require("../../img/icon/performance_250x250_0096d6.png")}
          alt=""
          id="ico"
        ></img>

        <h1 id="title"> Fast </h1>

        <p id="text">
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Esse numquam
          aliquam, maxime sint itaque eaque ea
        </p>
      </div>
      <div className="box">
        <img
          src={require("../../img/icon/cloudcontent_250x250_0096d6.png")}
          alt=""
          id="ico"
        ></img>

        <h1 id="title"> Cloud Based </h1>

        <p id="text">
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Esse numquam
          aliquam, maxime sint itaque eaque ea
        </p>
      </div>
    </div>
  );
};
