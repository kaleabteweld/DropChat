const Router = require("express").Router();
const jwt = require("jsonwebtoken");
const config = require("config");
const bcrypt = require("bcrypt");
const _ = require("lodash");

const fetch = require("node-fetch");

const { OAuth2Client } = require("google-auth-library");

var rug = require("random-username-generator");

const user_model = require("../models/user_model");
const group_model = require("../models/group_model");

const user_Validation_new = require("../models/Validation/user_Validation_new");
const user_Validation_login = require("../models/Validation/user_Validation_login");
const phone_number = require("../models/Validation/user_phone_number");

const auth = require("../middleware/auth");

// get user info
Router.get("/me", auth, (req, res) => {
  const id = req.user_id;
  user_model
    .findById(id)
    .then((data) => {
      data.pass = undefined;
      if (data == null) {
        res.status(404).send({ error_type: "can't accas" });
      } else res.status(200).send(data);
    })
    .catch((err) => {
      res.status(422).send({ error_type: "mongooes", error: err });
    });
});
// craet new user
Router.post("/me/signin", (req, res) => {
  const body = req.body;

  var body_toSave = body;

  // check if accout exist

  if ((body_toSave.user_name = "null")) {
    body_toSave.user_name = rug.generate();
  }

  const pavKey = config.get("jwt");

  // validate for uew users
  const validate = user_Validation_new(body);
  if (Object.keys(validate).includes("error")) {
    console.log(validate.error);
    res.status(422).send({ error_type: "joi", error: validate.error.details });
    return;
  }

  // pass bcrypt
  bcrypt.genSalt(10).then((salt) => {
    bcrypt.hash(body.pass, salt).then((newPass) => {
      body_toSave.pass = newPass;

      //spiting phone and region from phone
      if ((body_toSave.phone = "null")) {
        // body_toSave.phone = undefined;
        delete body_toSave["phone"];
        // console.log(body_toSave);
        // saveing to database
        const new_user_model = new user_model(body_toSave);
        new_user_model
          .save()
          .then((data) => {
            const id = data._id;
            const token = jwt.sign({ id: id }, pavKey);
            res
              .header("x-auth-token", token)
              .status(200)
              .send({ log_in: true });
          })
          .catch((err) => {
            console.log(err);
            res.status(422).send({ error_type: "mongooes", error: err });
          });
      } else {
        phone_number(body_toSave.phone)
          .then((data) => {
            // get all region data

            if (data.status == 0) {
              body_toSave.region = {
                country_code: data.country_code,
                country_code_iso3: data.country_code_iso3,
                country_name: data.country_name,
              };

              // saveing to database
              console.log(body_toSave);
              const new_user_model = new user_model(body_toSave);
              new_user_model
                .save()
                .then((data) => {
                  const id = data._id;
                  const token = jwt.sign({ id: id }, pavKey);
                  res
                    .header("x-auth-token", token)
                    .status(200)
                    .send({ log_in: true });
                })
                .catch((err) => {
                  res.status(422).send({ error_type: "mongooes", error: err });
                });
            } else {
              res
                .status(422)
                .send({ error_type: "nexmo", error: data.status_message });
            }
          })
          .catch((err) => {
            res.status(422).send({ error_type: "nexmo", error: err.message });
          });
      }
    });
  });
});
Router.post("/me/signin/other", (req, res) => {
  const body = req.body;

  let body_toSave = body;
  body_toSave.user_name = rug.generate();
  body_toSave.phone = " ";

  const pavKey = config.get("jwt");

  // cheak call is a cheak or signin
  if (body_toSave.check == "true") {
    // cheak if accout  exist
    user_model
      .find({ email: body_toSave.email })
      .then((data) => {
        if (data.length != 0) {
          res.status(200).send({ log_in: true });
        } else {
          res.status(400).send({ log_in: false });
        }
      })
      .catch((err) => {
        res.status(422).send({ error_type: "mongooes", error: err });
      });
  }
  if (body_toSave.check == "false") {
    // check if user_name exist

    if ((body_toSave.user_name = "null")) {
      body_toSave.user_name = rug.generate();
    }

    // pass bcrypt
    bcrypt.genSalt(10).then((salt) => {
      bcrypt.hash(body.pass, salt).then((newPass) => {
        body_toSave.pass = newPass;

        const new_user_model = new user_model(body_toSave);
        new_user_model
          // cract a new accout
          .save()
          .then((data) => {
            const id = data._id;
            const token = jwt.sign({ id: id }, pavKey);
            res
              .header("x-auth-token", token)
              .status(200)
              .send({ log_in: true });
          })
          .catch((err) => {
            if (err.keyPattern.email == 1) {
              // accout  exist
              user_model
                .find({ email: body_toSave.email })
                .then((data) => {
                  const id = data._id;
                  const token = jwt.sign({ id: id }, pavKey);
                  res
                    .header("x-auth-token", token)
                    .status(200)
                    .send({ log_in: true });
                })
                .catch((err) => {
                  res.status(422).send({ error_type: "mongooes", error: err });
                });
            }
          });
      });
    });
  }
});

// login
Router.post("/me/login", (req, res) => {
  const body = req.body;

  const pavKey = config.get("jwt");

  // validate for old users
  const validate = user_Validation_login(body);
  if (Object.keys(validate).includes("error")) {
    res.status(422).send({ error_type: "joi", error: validate.error.details });
    return;
  }

  // check for email
  user_model
    .find({ email: body.email })
    .then((data) => {
      if (data.length != 0) {
        Data = data[0];

        // check password
        bcrypt
          .compare(body.pass, Data.pass)
          .then((data) => {
            if (data) {
              const id = Data._id;
              const token = jwt.sign({ id: id }, pavKey);
              res
                .header("x-auth-token", token)
                .status(200)
                .send({ log_in: true });
            } else {
              res.status(422).send({
                error_type: "mongoose",
                error: "email or password not correct",
              });
            }
          })
          .catch((err) => {
            res.status(422).send({
              error_type: "mongoose",
              error: "email or password not correct",
            });
          });
      } else {
        res.status(422).send({
          error_type: "mongoose",
          error: "email or password not correct",
        });
      }
    })
    .catch((err) => {
      res.status(422).send({ error_type: "mongoose", err });
    });
});
Router.post("/me/login/google", (req, res) => {
  const body = req.body;

  const pavKey = config.get("jwt");
  // get google token data
  const client = new OAuth2Client(
    "95718633232-7f5pfdr34jt1g0gccuoek0kmmpga56t5.apps.googleusercontent.com"
  );
  client
    .verifyIdToken({
      idToken: body.token,
      audience:
        "95718633232-7f5pfdr34jt1g0gccuoek0kmmpga56t5.apps.googleusercontent.com",
    })
    .then((data) => {
      // get email
      const email = data.payload.email;
      // check for email
      user_model
        .find({ email: email })
        .then((data) => {
          if (data.length != 0) {
            Data = data[0];

            const id = Data._id;
            const token = jwt.sign({ id: id }, pavKey);
            res
              .header("x-auth-token", token)
              .status(200)
              .send({ log_in: true });
          } else {
            res.status(422).send({
              error_type: "mongoose",
              error: "email or password not correct",
            });
          }
        })

        .catch((err) => {
          console.log(err);
          res.status(422).send({ error_type: "mongoose", err });
        });
    })
    .catch((err) => {
      console.log(err);
    });
});
Router.post("/me/login/facebook", (req, res) => {
  const body = req.body;
  const pavKey = config.get("jwt");

  fetch("https://graph.facebook.com/me?fields=email&access_token=" + body.token)
    .then((response) => response.json())
    .then((data) => {
      if (data.email.length != 0) {
        // get email
        const email = data.email;
        // check for email
        user_model
          .find({ email: email })
          .then((data) => {
            if (data.length != 0) {
              Data = data[0];

              const id = Data._id;
              const token = jwt.sign({ id: id }, pavKey);
              res
                .header("x-auth-token", token)
                .status(200)
                .send({ log_in: true });
            } else {
              res.status(422).send({
                error_type: "mongoose",
                error: "email or password not correct",
              });
            }
          })
          .catch((err) => {
            console.log(err);
            res.status(422).send({ error_type: "mongoose", err });
          });
      } else {
        res
          .status(422)
          .send({ error_type: "facebook", err: "no email connected" });
      }
    })
    .catch((err) => console.error(err));
});

// updata user
Router.put("/me", auth, (req, res) => {
  const body = req.body;
  var toSave = body;

  const id = req.user_id;

  // hash the pass
  bcrypt.genSalt(10).then((salt) => {
    bcrypt.hash(body.pass, salt).then((pass) => {
      toSave.pass = pass;

      // update eveyting
      user_model
        .updateOne({ _id: id }, { $set: toSave })
        .then((data) => {
          if (data.nModified != 0) res.status(200).send({ updateOne: true });
          else res.status(422).send({ error_type: "can't accas" });
        })
        .catch((err) => {
          res.status(422).send({ error_type: "mongoose", error: err });
        });
    });
  });
});
// delete user
Router.delete("/me", auth, (req, res) => {
  const id = req.user_id;
  user_model
    .deleteOne({ _id: id })
    .then((data) => {
      if (data.deletedCount != 0) res.status(200).send({ delete: true });
      else res.status(404).send({ error_type: "can't accas" });
    })
    .catch((err) => {
      res.status(422).send({ error_type: "mongoose", error: err });
    });
});

// other user fechers

// leave a group
Router.delete("/group", auth, (req, res) => {
  const user_id = req.user_id;
  const group_id = Buffer.from(String(req.body.group), "base64").toString(
    "ascii"
  );

  // cheak if group exist
  group_model
    .findById(group_id)
    .then(() => {
      // cheak if user exist
      user_model
        .findById(user_id)
        .then(() => {
          user_model
            .findByIdAndUpdate(
              { _id: user_id },
              { $pull: { groups: group_id } }
            )
            .then(() => {
              // check if user is last one
              group_model
                .findById(group_id)
                .then((data) => {
                  if (data != null) {
                    if (data.members.length == 1 || data.admins.length == 1) {
                      group_model
                        .findByIdAndDelete(group_id)
                        .then(() => {
                          res.status(200).send({ done: true });
                        })
                        .catch((err) => {
                          console.log(err);
                          res
                            .status(422)
                            .send({ error_type: "mongooes", error: err });
                        });
                    } else {
                      group_model
                        .findByIdAndUpdate(
                          { _id: group_id },
                          { $pull: { members: user_id, admins: user_id } }
                        )
                        .then(() => {
                          res.status(200).send({ done: true });
                        })
                        .catch((err) => {
                          console.log(err);
                          res
                            .status(422)
                            .send({ error_type: "mongooes", error: err });
                        });
                    }
                  } else {
                    res.status(422).send({ error_type: "group not found" });
                  }
                })
                .catch((err) => {
                  console.log(err);
                  res.status(422).send({ error_type: "mongooes", error: err });
                });
            })
            .catch((err) => {
              console.log(err);
              res.status(422).send({ error_type: "mongooes", error: err });
            });
        })
        .catch((err) => {
          console.log(err);
          res
            .status(422)
            .send({ error_type: "mongooes", error: "user not foued" });
        });
    })

    .catch((err) => {
      console.log(err);
      res
        .status(422)
        .send({ error_type: "mongooes", error: "group  not foued" });
    });
});

module.exports = Router;
