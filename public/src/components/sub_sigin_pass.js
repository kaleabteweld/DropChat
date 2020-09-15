import React, { useState, useRef } from "react";

import axios from "axios";
import $ from "jquery";

import { Redirect } from "react-router-dom";

import "../components/css/sign.css";

function Sub_sigin_pass(props) {
  console.log(props);

  const [auth_state_st, setauth_state_st] = useState(false);

  const [inputpass, setinputpass] = useState("");
  var pass = useRef();

  var Input = (event) => {
    setinputpass($(pass.current).val());
  };

  var Submit = (event) => {
    event.preventDefault();
    console.log(props.Res);
    if (props.Res.type == "google") {
      axios
        .post("http://localhost:4000/api/users/me/signin/other", {
          img: props.Res.res.profileObj.imageUrl,
          email: props.Res.res.profileObj.email,
          name: props.Res.res.profileObj.name,
          pass: inputpass,
          user_name: "null",
          phone: "null",
        })
        .then(function (response) {
          // handle success
          console.log("success", response.data);
          localStorage.setItem("auth-token", response.headers["x-auth-token"]);
          // dispatch(log_in_ac());
          setauth_state_st(true);
        })
        .catch(function (error) {
          // handle error
          console.log(error.response);
          if (error.response != undefined) {
            if (error.response.data.error_type == "joi") {
              console.log("pass");
              error.response.data.error.map((err) => {
                console.log(err.context.key);
                $(pass.current).addClass("is-invalid");
                $(pass.current).siblings(".invalid-feedback").text(err.message);
              });
            }
          }
          setauth_state_st(false);
        });
    } else {
      axios
        .post("http://localhost:4000/api/users/me/signin/other", {
          img: props.Res.res.picture.data.url,
          email: props.Res.res.email,
          name: props.Res.res.name,
          pass: inputpass,
          user_name: "null",
          phone: "null",
          check: "false",
        })
        .then(function (response) {
          // handle success
          console.log("success", response.data);
          localStorage.setItem("auth-token", response.headers["x-auth-token"]);
          // dispatch(log_in_ac());
          setauth_state_st(true);
        })
        .catch(function (error) {
          // handle error
          console.log(error.response);
          if (error.response != undefined) {
            if (error.response.data.error_type == "joi") {
              console.log("pass");
              error.response.data.error.map((err) => {
                console.log(err.context.key);
                $(pass.current).addClass("is-invalid");
                $(pass.current).siblings(".invalid-feedback").text(err.message);
              });
            }
            if (error.response.data.error_type == "mongooes") {
              $(pass.current).addClass("is-invalid");
              $(pass.current)
                .siblings(".invalid-feedback")
                .text(`${error.response.data.error.keyPattern} taken`);
            }
          }
          setauth_state_st(false);
        });
    }
  };

  if (auth_state_st) {
    return <Redirect to="/login" />;
  } else {
    return (
      <div className="main">
        <form className="form_sig" onSubmit={Submit}>
          <div className="form-group">
            <label for="pass">password</label>
            <input
              type="password"
              name="pass"
              className="form-control"
              id="pass"
              placeholder="*******"
              value={inputpass}
              ref={pass}
              onChange={Input}
            ></input>
            <div id="error_pass" className="invalid-feedback">
              <p>check your password</p>
            </div>
          </div>

          <div className="other">
            <button
              id="posts"
              type="submit"
              value="submit"
              className="btn btn-success"
            >
              {" "}
              sign In
            </button>
          </div>
        </form>
      </div>
    );
  }
}

export default Sub_sigin_pass;
