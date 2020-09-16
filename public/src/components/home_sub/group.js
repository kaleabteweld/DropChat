import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";

import "../css/home_sud/group.css";

import Group_sub from "./group_sub";
import Modal from "./modal";

let Group = () => {
  const auth_token = localStorage.getItem("auth-token");
  const auth_state = useSelector((state) => state.auth);
  const were_state = useSelector((state) => state.were_now);

  const [groups, setGroups] = useState(auth_state.user_data.groups);

  var New = () => {};

  if (groups.length != 0) {
    return (
      <div id="Group">
        {groups.map((data) => (
          <Group_sub />
        ))}

        <div
          class="newOradd"
          type="button"
          class="btn btn-primary"
          data-toggle="modal"
          data-target="#exampleModal"
        >
          <img src="../DropTalk/img/main/addapk.png" data="Group"></img>
        </div>
        <Modal />
      </div>
    );
  } else {
    return (
      <div id="Group">
        <div class="none">
          {" "}
          <p> no Group's Make One?</p>{" "}
        </div>

        <div class="newOradd" data-toggle="modal" data-target="#exampleModal">
          <img src="../DropTalk/img/main/addapk.png" data="Group"></img>
        </div>
        <Modal />
      </div>
    );
  }
};

export default Group;
