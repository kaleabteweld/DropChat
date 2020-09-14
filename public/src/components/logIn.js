import React, { useState, useRef } from "react";
import { Redirect, Link } from "react-router-dom";

import axios from "axios";

import { useSelector, useDispatch } from "react-redux";

import $ from "jquery";

import FacebookLogin from "react-facebook-login";
import GoogleLogin from "react-google-login";

import "./css/logIn.css";

function LogIn() {
  const auth_state = useSelector((state) => state.auth);
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

    // let email = $("#form #email");
    // let password = $("#form #pass");

    // var email_error = email.siblings("#error_email");
    // var password_error = password.siblings("#error_pass");

    // let email_ = email.val();
    // let password_ = password.val();
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
          console.log(response);
          console.log("all good login");
          setauth_state_st(true);
        })
        .catch((err) => {
          console.log(err.response);
          setauth_state_st("new");
        });
    }
  };

  var facebookRespones = (res) => {
    if (res.profileObj == null || res.profileObj == undefined) {
    } else {
      console.log(res);
      axios
        .post("http://localhost:4000/api/users/me/login/facebook", {
          token: res.accessToken,
        })
        .then(function (response) {
          console.log(response);
          console.log("all good login");
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
