import React from "react";

import "../css/home_sud/modal.css";

const Modal = () => {
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
            >
              <div className="form-group">
                <div className="upload_but" for="img"></div>
                <input type="file" name="img" className="upload_shit"></input>
              </div>

              <div className="form-group">
                <label for="name">name</label>
                <input
                  type="text"
                  name="name"
                  className="form-control name"
                  placeholder="name"
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
