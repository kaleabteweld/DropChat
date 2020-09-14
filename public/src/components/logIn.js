import React, { useState, useRef } from "react";
import { Redirect, Link } from "react-router-dom";

import axios from "axios";

import { useSelector, useDispatch } from "react-redux";

import $ from "jquery";

import FacebookLogin from "react-facebook-login";
import GoogleLogin from "react-google-login";

import log_in_ac from "../redux/action/log_in";

import "./css/logIn.css";

function LogIn() {
  const auth_state = useSelector((state) => state.auth);
  const dispatch = useDispatch();

  const [auth_state_st, setauth_state_st] = useState(auth_state.log_in);

  const [email, setemail] = useState("");
  const [pass, setepass] = useState("");

  var input_ele = {
    email: useRef(),
    pass: useRef(),
  };

  let emailCh = (event) => {
    let target = $(input_ele["email"].target);
    setemail(target.val());
  };

  let passCh = (event) => {
    let target = $(input_ele["pass"].target);
    setepass(target.val());
  };

  let Submit = (event) => {
    event.preventDefault();
    let data = {
      email: $(input_ele["email"].current).val(),
      pass: $(input_ele["pass"].current).val(),
    };

    axios
      .post("http://localhost:4000/api/users/me/login", data)
      .then(function (response) {
        // handle success
        $(".main .form_sig .form-group input.is-invalid").removeClass(
          "is-invalid"
        );
        $(".main .form_sig .form-group input.is-invalid").addClass("is-valid");
        console.log("success", response.data);
        localStorage.setItem("auth-token", response.headers["x-auth-token"]);

        // get user data
        axios
          .get("http://localhost:4000/api/users/me", {
            headers: { "x-auth-token": response.headers["x-auth-token"] },
          })
          .then(function (response) {
            dispatch(
              log_in_ac({
                data: response.data,
                token: localStorage.getItem("auth-token"),
              })
            );
          });

        setauth_state_st(true);
      })
      .catch((error) => {
        console.log(error.response);
        $(".main .form_sig .form-group input.is-invalid").removeClass(
          "is-invalid"
        );
        if (error.response != undefined) {
          if (error.response.data.error_type == "joi") {
            console.log(input_ele[error.response.data.error]);
            error.response.data.error.map((err) => {
              console.log(err.context.key);
              $(input_ele[err.context.key].current).addClass("is-invalid");
              $(input_ele[err.path].current)
                .siblings(".invalid-feedback")
                .text(err.message);
            });
          }
          if (error.response.data.error_type == "mongoose") {
            alert(error.response.data.error);
            $(".main .form_sig .form-group input").val("");
          }
        }
      });
  };

  var googleRespones = (res) => {
    if (res.profileObj == null || res.profileObj == undefined) {
    } else {
      console.log(res);
      axios
        .post("http://localhost:4000/api/users/me/login/google", {
          token: res.tokenId,
        })
        .then(function (response) {
          // console.log(response);
          localStorage.setItem("auth-token", response.headers["x-auth-token"]);

          // get user data
          axios
            .get("http://localhost:4000/api/users/me", {
              headers: { "x-auth-token": localStorage.getItem("auth-token") },
            })
            .then(function (response) {
              dispatch(
                log_in_ac({
                  data: response.data,
                  token: localStorage.getItem("auth-token"),
                })
              );
            });
          setauth_state_st(true);
        })
        .catch((err) => {
          console.log(err.response);
          setauth_state_st("new");
        });
    }
  };

  var facebookRespones = (res) => {
    if (res.name == null || res.name == undefined) {
    } else {
      console.log(res);
      axios
        .post("http://localhost:4000/api/users/me/login/facebook", {
          token: res.accessToken,
        })
        .then(function (response) {
          // console.log(response);
          localStorage.setItem("auth-token", response.headers["x-auth-token"]);

          // get user data
          axios
            .get("http://localhost:4000/api/users/me", {
              headers: { "x-auth-token": localStorage.getItem("auth-token") },
            })
            .then(function (response) {
              dispatch(
                log_in_ac({
                  data: response.data,
                  token: localStorage.getItem("auth-token"),
                })
              );
            });

          setauth_state_st(true);
        })
        .catch((err) => {
          console.log(err.response);
          setauth_state_st("new");
        });
    }
  };

  if (auth_state_st == true) {
    return <Redirect to="/home" />;
  }
  if (auth_state_st == "new") {
    return <Redirect to="/signIn" />;
  } else {
    return (
      <div className="main">
        <form className="form_sig" onSubmit={Submit}>
          <div className="form-group">
            <label for="email">Email</label>
            <input
              type="text"
              name="email"
              className="form-control"
              id="email"
              placeholder="email@example.com"
              value={email}
              ref={input_ele["email"]}
              onChange={emailCh}
            ></input>
            <div id="error_email" className="invalid-feedback">
              <p>check your Email</p>
            </div>
          </div>

          <div className="form-group">
            <label for="pass">password</label>
            <input
              type="password"
              name="pass"
              className="form-control"
              id="pass"
              placeholder="*******"
              value={pass}
              ref={input_ele["pass"]}
              onChange={passCh}
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
              Log In
            </button>
            <Link to="/signIn" className="btn btn btn-primary">
              Sign Up
            </Link>
            <GoogleLogin
              clientId="95718633232-7f5pfdr34jt1g0gccuoek0kmmpga56t5.apps.googleusercontent.com"
              buttonText="Login"
              onSuccess={googleRespones}
              onFailure={googleRespones}
              cookiePolicy={"single_host_origin"}
              className="g_but btn btn-dange"
            />
            <FacebookLogin
              appId="799827897429258"
              autoLoad={false}
              fields="name,email,picture"
              onClick={facebookRespones}
              callback={facebookRespones}
              cssClass="fb_but btn btn-primary"
            />
          </div>
        </form>
      </div>
    );
  }
}

export default LogIn;
