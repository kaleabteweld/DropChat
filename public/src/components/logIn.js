import React, { Component, useContext, useState } from "react";

import "./css/logIn.css";

import { Redirect, Link } from "react-router-dom";

import $ from "jquery";

function LogIn() {
  let log_inState = {
    log_in: false,
  };
  const [email, setemail] = useState("");
  const [pass, setepass] = useState("");

  let emailCh = (event) => {
    let target = $(event.target);
    setemail(target.val());
  };

  let passCh = (event) => {
    let target = $(event.target);
    setepass(target.val());
  };

  let Submit = (event) => {
    event.preventDefault();

    let email = $("#form #email");
    let password = $("#form #pass");

    var email_error = email.siblings("#error_email");
    var password_error = password.siblings("#error_pass");

    let email_ = email.val();
    let password_ = password.val();
  };

  if (log_inState.log_in) {
    return <Redirect to="/home" />;
  } else {
    return (
      <div className="main">
        <form id="form" onSubmit={Submit}>
          <div className="form-group">
            <label for="email">Email</label>
            <input
              type="text"
              name="email"
              className="form-control"
              id="email"
              placeholder="email@example.com"
              value={email}
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
              onChange={passCh}
            ></input>
            <div id="error_pass" className="invalid-feedback">
              <p>check your password</p>
            </div>
          </div>

          <button
            id="post"
            type="submit"
            value="submit"
            className="btn btn-success"
          >
            Log In
          </button>
          <Link to="/signIn" className="btn btn btn-primary">
            Sign Up
          </Link>
        </form>
      </div>
    );
  }
}

// class LogIn extends Component {
//   constructor(props) {
//     super(props);

//     this.state = {
//       email: "",
//       pass: "",
//       log_in: false,
//     };
//   }

//   render() {

//   }
// }

export default LogIn;
