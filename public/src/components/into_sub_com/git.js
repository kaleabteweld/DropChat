import React from "react";

import "../css/into_sub_com/git.css";
export default () => {
  return (
    <div id="join">
      <img src={require("../../img/download (2).png")} id="git"></img>
      <p id="text">Do U Think U Can Help Us Make DropTalk Better</p>

      <a
        id="go"
        href="https://github.com/kaleabteweld/DropChat"
        class="btn btn-success"
      >
        Go
      </a>
    </div>
  );
};
