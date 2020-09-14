import React, { useState, useRef } from "react";
import { useDispatch } from "react-redux";
import axios from "axios";

import log_in_ac from "../redux/action/log_in";

const get = () => {
  const dispatch = useDispatch();
  const token = localStorage.getItem("auth-token");
  axios
    .get("http://localhost:4000/api/users/me", {
      headers: { "x-auth-token": token },
    })
    .then(function (response) {
      dispatch(
        log_in_ac({
          data: response.data,
          token: token,
        })
      );
    });

  return;
};

export default get;

// import React from 'react'

// export const get_user_data = () => {
//     return (
//         <div>

//         </div>
//     )
// }
