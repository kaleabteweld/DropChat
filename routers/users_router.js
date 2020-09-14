const Router = require("express").Router();
const jwt = require("jsonwebtoken");
const config = require("config");
const bcrypt = require("bcrypt");
const _ = require("lodash");

const { OAuth2Client } = require("google-auth-library");

var rug = require("random-username-generator");

const user_model = require("../models/user_model");

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

  let body_toSave = body;

  const pavKey = config.get("jwt");

  // validate for uew users
  const validate = user_Validation_new(body);
  if (Object.keys(validate).includes("error")) {
    res.status(422).send({ error_type: "joi", error: validate.error.details });
    return;
  }

  // pass bcrypt
  bcrypt.genSalt(10).then((salt) => {
    bcrypt.hash(body.pass, salt).then((newPass) => {
      body_toSave.pass = newPass;

      //spiting phone and region from phone
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
    });
  });
});
Router.post("/me/signin/google", (req, res) => {
  const body = req.body;

  let body_toSave = body;
  body_toSave.user_name = rug.generate();
  body_toSave.pass = " ";
  body_toSave.phone = " ";

  const pavKey = config.get("jwt");

  // saveing to database
  const new_user_model = new user_model(body_toSave);
  new_user_model
    .save()
    .then((data) => {
      const id = data._id;
      const token = jwt.sign({ id: id }, pavKey);
      res.header("x-auth-token", token).status(200).send({ log_in: true });
    })
    .catch((err) => {
      if (err.keyPattern.email == 1) {
        // need log
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
Router.post("/me/signin/facebook", (req, res) => {
  const body = req.body;

  let body_toSave = body;
  body_toSave.user_name = rug.generate();
  body_toSave.pass = " ";
  body_toSave.phone = " ";

  const pavKey = config.get("jwt");

  // saveing to database
  const new_user_model = new user_model(body_toSave);
  new_user_model
    .save()
    .then((data) => {
      const id = data._id;
      const token = jwt.sign({ id: id }, pavKey);
      res.header("x-auth-token", token).status(200).send({ log_in: true });
    })
    .catch((err) => {
      if (err.keyPattern.email == 1) {
        // need log
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

  fetch(`https://graph.facebook.com/me?fields=email&access_token=${body.token}`)
    .then((response) => response.json())
    .then((data) => {
      console.log(data);
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

module.exports = Router;
