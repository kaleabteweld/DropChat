const Router = require("express").Router();
const jwt = require("jsonwebtoken");
const config = require("config");
const bcrypt = require("bcrypt");
const _ = require("lodash");

const fetch = require("node-fetch");

const group_model = require("../models/group_model");
const group_Validation = require("../models/Validation/group_Validation");

const auth = require("../middleware/auth");

// make a new group
Router.post("/", auth, (req, res) => {
  const body = req.body;
  var body_toSave = body;

  const validate = group_Validation(body);
  if (Object.keys(validate).includes("error")) {
    console.log(validate.error);
    res.status(422).send({ error_type: "joi", error: validate.error.details });
    return;
  }

  const creater_user_id = req.user_id;
  body_toSave.admins = [creater_user_id];
  body_toSave.members = [creater_user_id];

  // saveing to database
  console.log(body_toSave);
  const new_group_model = new group_model(body_toSave);
  new_group_model
    .save()
    .then((data) => {
      // get group link
      new_group_model
        .getLink()
        .then((data) => {
          res.status(200).send({ link: data });
        })
        .catch((err) => {
          console.log(err);
          res.status(422).send({ error_type: "bcrypt", error: err });
        });
    })
    .catch((err) => {
      console.log(err);
      res.status(422).send({ error_type: "mongooes", error: err });
    });
});

module.exports = Router;
