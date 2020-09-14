import React, { useState, useEffect, useContext, useRef } from "react";
import { Redirect } from "react-router-dom";
import $ from "jquery";

import axios from "axios";

import { useSelector, useDispatch } from "react-redux";

import FacebookLogin from "react-facebook-login";
import GoogleLogin from "react-google-login";

import "../components/css/sign.css";

import log_in_ac from "../redux/action/log_in";

function SignIn() {
  const [inputname, setinputname] = useState("");
  const [inputemail, setinputemail] = useState("");
  const [inputpass, setinputpass] = useState("");
  const [inputus_name, setinputus_name] = useState("");
  const [inputphone, setinputphone] = useState("");

  const dispatch = useDispatch();
  const auth_state = useSelector((state) => state.auth);

  const [auth_state_st, setauth_state_st] = useState(auth_state.log_in);

  var input_ele = {
    name: useRef(),
    user_name: useRef(),
    phone: useRef(),
    email: useRef(),
    pass: useRef(),
  };

  var Input = (event) => {
    let target = $(event.target);
    switch ($(target).attr("name")) {
      case "name":
        setinputname($(input_ele[target]).val());
        break;
      case "us_name":
        setinputus_name($(input_ele[target]).val());
        break;
      case "email":
        setinputemail($(input_ele[target]).val());
        break;
      case "phone":
        setinputphone($(input_ele[target]).val());
        break;
      case "pass":
        setinputpass($(input_ele[target]).val());
        break;
    }
  };

  var Submit = (e) => {
    e.preventDefault();
    let data = {
      name: $(input_ele["name"].current).val(),
      user_name: $(input_ele["user_name"].current).val(),
      phone: $(input_ele["phone"].current).val(),
      email: $(input_ele["email"].current).val(),
      pass: $(input_ele["pass"].current).val(),
    };
    // console.log(data);

    axios
      .post("http://localhost:4000/api/users/me/signin", data)
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
      .catch(function (error) {
        // handle error
        $(".main #form_sig .form-group input.is-invalid").removeClass(
          "is-invalid"
        );
        console.log(error.response);
        if (error.response != undefined) {
          if (error.response.data.error_type == "nexmo") {
            $(input_ele["phone"].current).addClass("is-invalid");
            $(input_ele["phone"].current)
              .siblings(".invalid-feedback")
              .text(error.response.data.error);
          } else if (error.response.data.error_type == "joi") {
            console.log(input_ele[error.response.data.error]);
            error.response.data.error.map((err) => {
              console.log(err.context.key);
              $(input_ele[err.context.key].current).addClass("is-invalid");
              $(input_ele[err.path].current)
                .siblings(".invalid-feedback")
                .text(err.message);
            });
          } else if (error.response.data.error_type == "mongoose") {
            Object.keys(error.response.data.error.keyPattern).map((da) => {
              $(input_ele[da].current).addClass("is-invalid");
              $(input_ele[da].current)
                .siblings(".invalid-feedback")
                .text(`${da} taken`);
            });
          }
        }
      });
  };

  var googleRespones = (res) => {
    console.log(res);
    var google_res = res;
    if (res.profileObj == null || res.profileObj == undefined) {
    } else {
      axios
        .post("http://localhost:4000/api/users/me/signin/google", {
          img: res.profileObj.imageUrl,
          email: res.profileObj.email,
          name: res.profileObj.name,
          ac_type: "google",
          ac_typ_token: google_res.accessToken,
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
          setauth_state_st(false);
        });
    }
  };
  var facebookRespones = (res) => {
    var facebook_res = res;
    console.log(res);
    if (res.name == null || res.name == undefined) {
    } else {
      axios
        .post("http://localhost:4000/api/users/me/signin/facebook", {
          img: res.picture.data.url,
          email: res.email,
          name: res.name,
          ac_type: "facebook",
          ac_typ_token: facebook_res.accessToken,
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
          setauth_state_st(false);
        });
    }
  };

  console.log(auth_state_st);
  if (auth_state_st) {
    return <Redirect to="/login" />;
  } else {
    return (
      <div className="main">
        <form className="form_sig" onSubmit={Submit}>
          <div className="T">
            <div className="form-group">
              <label for="name">your full Name</label>
              <input
                type="text"
                className="form-control"
                id="name"
                name="name"
                placeholder="name"
                value={inputname}
                onChange={Input}
                ref={input_ele["name"]}
              ></input>
              <div id="email_id" className="invalid-feedback">
                <p>Enter your Name</p>
              </div>
            </div>
          </div>
          <div className="T">
            <div className="form-group">
              <label for="us_name">your user name</label>
              <input
                type="text"
                className="form-control"
                id="us_name"
                name="us_name"
                placeholder="user name"
                value={inputus_name}
                onChange={Input}
                ref={input_ele["user_name"]}
              ></input>
              <div id="email_id" className="invalid-feedback">
                <p>Enter your Name</p>
              </div>
            </div>
          </div>
          <div className="T">
            <div className="form-group">
              <label for="phone">your phone number</label>
              <input
                type="text"
                className="form-control"
                id="phone"
                name="phone"
                placeholder="your phone number [+251,+1......]"
                value={inputphone}
                onChange={Input}
                ref={input_ele["phone"]}
              ></input>
              <div id="email_id" className="invalid-feedback">
                <p>Enter your Name</p>
              </div>
            </div>
          </div>
          <div className="T">
            <div className="form-group">
              <label for="emaill">Email</label>
              <input
                type="text"
                className="form-control"
                id="emaill"
                name="email"
                placeholder="email@example.com"
                value={inputemail}
                onChange={Input}
                ref={input_ele["email"]}
              ></input>
              <div className="invalid-feedback" id="error_email">
                <p>check your Email</p>
              </div>
            </div>
          </div>
          <div className="form-group">
            <label for="passs">password</label>
            <input
              type="password"
              className="form-control"
              id="passs"
              name="pass"
              placeholder="*******"
              value={inputpass}
              onChange={Input}
              ref={input_ele["pass"]}
            ></input>
            <div className="invalid-feedback" id="error_pass">
              <p>
                check your password, Must Be less Than Or Equal 8 Charcter's
              </p>
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

export default SignIn;
