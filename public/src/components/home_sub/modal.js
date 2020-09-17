import React, { useState, useRef } from "react";
import $ from "jquery";
import axios from "axios";

import "../css/home_sud/modal.css";

const Modal = () => {
  const auth_token = localStorage.getItem("auth-token");

  const [inputname, setinputname] = useState("");
  const [inputBio, setinputBio] = useState("");

  var input_ele = {
    img: useRef(),
    name: useRef(),
    bio: useRef(),
  };
  var Input = (event) => {
    let target = $(event.target);
    switch ($(target).attr("name")) {
      case "name":
        setinputname($(input_ele[target]).val());
        break;
      case "bio":
        setinputBio($(input_ele[target]).val());
        break;
    }
  };

  const allgood = (e) => {
    e.preventDefault();
    let data = {
      img: $(input_ele["img"].current).val(),
      name: $(input_ele["name"].current).val(),
      bio: $(input_ele["bio"].current).val(),
    };

    axios
      .post("http://localhost:4000/api/group/", data, {
        headers: { "x-auth-token": auth_token },
      })
      .then((response) => {
        console.log(response);
      })
      .catch((err) => {
        console.log(err.response);
      });
  };

  return (
    <div
      className="modal fade"
      id="exampleModal"
      tabindex="-1"
      role="dialog"
      aria-labelledby="exampleModalLabel"
      aria-hidden="true"
    >
      <div className="modal-dialog" role="document">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title" id="exampleModalLabel">
              Make A New Group
            </h5>
            <button
              type="button"
              className="close"
              data-dismiss="modal"
              aria-label="Close"
            >
              <span aria-hidden="true">&times;</span>
            </button>
          </div>
          <div className="modal-body">
            <form
              className="form"
              id="group"
              action="../DropTalk/backEnd/make_new_group.php"
              method="post"
              enctype="multipart/form-data"
              onSubmit={allgood}
            >
              <div className="form-group">
                <div className="upload_but" for="img"></div>
                <input
                  type="file"
                  name="img"
                  className="upload_shit"
                  ref={input_ele.img}
                ></input>
              </div>

              <div className="form-group">
                <label for="name">name</label>
                <input
                  type="text"
                  name="name"
                  className="form-control name"
                  placeholder="name"
                  ref={input_ele.name}
                  value={inputname}
                  onChange={Input}
                ></input>
                <div className="invalid-feedback">
                  <p>check the name</p>
                </div>
              </div>

              <div className="form-group">
                <label for="bio">Bio</label>
                <input
                  type="text"
                  name="bio"
                  className="form-control bio"
                  placeholder="bio"
                  ref={input_ele.bio}
                  value={inputBio}
                  onChange={Input}
                ></input>
                <div className="invalid-feedback">
                  <p>check your Bio</p>
                </div>
              </div>

              <button
                type="submit"
                value="submit"
                className="btn btn-success post"
              >
                Crate Group
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Modal;
