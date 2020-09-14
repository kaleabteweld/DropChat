import React from "react";

import "../css/into_sub_com/get.css";
export default () => {
  return (
    <div id="get" className="container-fluid">
      <div id="inot">
        <img
          src={require("../../img/icon/Devices-dark.png")}
          alt=""
          id="ico"
        ></img>
        <h2 id="title"> last but not least cross palfrom</h2>
      </div>

      <div id="download">
        <button className="btn btn-primary">For android</button>
        <button className="btn btn-primary">For IOS</button>
        <button className="btn btn-primary">For pc</button>
      </div>
    </div>
  );
};
