import React from "react";

import { useSelector, useDispatch } from "react-redux";
import Ch_view from "../../redux/action/ch_view";

import "../css/home_sud/bottom_nav.css";

const Bottom_nav = () => {
  const dispatch = useDispatch();

  const go = (event) => {
    dispatch(Ch_view({ to: "group" }));
  };
  return (
    <nav id="nav_bottom" class="navbar fixed-bottom ">
      <a id="group" onClick={go}>
        <img src={require("../../img/icon/group.png")}></img>
      </a>
      <a id="channels" href="Channels">
        <img src={require("../../img/icon/ball.png")}></img>
      </a>
      <a id="post" href="Post">
        <img src="../DropTalk/img/main/intro_ic_pencil.png"></img>
      </a>
      <a id="communitie" href="Communitie">
        <img src="../DropTalk/img/main/OneNoteSectionGroupMedTile.scale-400.png"></img>
      </a>
      <a id="chat" href="Chat">
        <img src="../DropTalk/img/main/chats_emptystate_v3.png"></img>
      </a>
    </nav>
  );
};

export default Bottom_nav;
