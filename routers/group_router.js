const Router = require("express").Router();

const fetch = require("node-fetch");

const group_model = require("../models/group_model");
const user_model = require("../models/user_model");

const group_Validation = require("../models/Validation/group_Validation");

const auth = require("../middleware/auth");

const img_upload = require("../middleware/img_upload_middleware/group_img_upload");

// get group info
Router.get("/:group", auth, (req, res) => {
  const user_id = req.user_id;
  const group_id = Buffer.from(req.params.group, "base64").toString("ascii");
  group_model
    .findById(group_id)
    .then((data) => {
      res.status(200).send({ data });
    })
    .catch((err) => {
      console.log(err);
      res.status(422).send({ error_type: "mongooes", error: err });
    });
});

// join a group
Router.post("/join", auth, (req, res) => {
  const user_id = req.user_id;
  const group_id = Buffer.from(req.body.group, "base64").toString("ascii");

  group_model
    .findById(group_id)
    .then((Gdata) => {
      // get user info
      if (Gdata != null) {
        user_model
          .findById(user_id)
          .then((Udata) => {
            const user_groups = Udata.groups;
            if (user_groups.indexOf(group_id) == -1) {
              // updateing the user groups
              user_model
                .findByIdAndUpdate(
                  { _id: user_id },
                  {
                    $push: {
                      groups: group_id,
                    },
                  }
                )
                .then(() => {
                  // updateing the groups members
                  group_model
                    .findByIdAndUpdate(
                      { _id: group_id },
                      {
                        $push: {
                          members: user_id,
                        },
                      }
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
                })
                .catch((err) => {
                  console.log(err);
                  res.status(422).send({ error_type: "mongooes", error: err });
                });
            } else {
              res.status(422).send({ error_type: "overwirrit" });
            }
          })
          .catch((err) => {
            console.log(err);
            res.status(422).send({ error_type: "mongooes", error: err });
          });
      } else {
        res.status(422).send({ error_type: "group not found" });
      }
    })
    .catch((err) => {
      console.log(err);
      res.status(422).send({ error_type: "mongooes", error: err });
    });
});

// delete a group
Router.delete("/", auth, (req, res) => {
  const user_id = req.user_id;
  const group_id = Buffer.from(String(req.body.group), "base64").toString(
    "ascii"
  );

  group_model
    .findById(group_id)
    .then((data) => {
      const admins = data.admins;
      if (admins.indexOf(user_id) != -1) {
        group_model
          .findByIdAndDelete(group_id)
          .then(() => {
            res.status(200).send({ done: true });
          })
          .catch((err) => {
            console.log(err);
            res.status(422).send({ error_type: "mongooes", error: err });
          });
      } else {
        res.status(404).send({ error_type: "access" });
      }
    })
    .catch((err) => {
      console.log(err);
      res.status(422).send({ error_type: "mongooes", error: err });
    });
});

// make a new group and join
Router.post("/", auth, (req, res) => {
  const body = req.body;
  var body_toSave = body;

  img_upload(req, res, (err) => {
    if (err) {
      console.log(err);
      res.status(422).send({ error_type: "img_upload", error: err });
      return;
    } else {
      if (req.file != undefined) {
        body_toSave.img = req.file.path;
      }
    }
  });

  // Validation
  const validate = group_Validation(body);
  if (Object.keys(validate).includes("error")) {
    console.log(validate.error);
    res.status(422).send({ error_type: "joi", error: validate.error.details });
    return;
  }

  const user_id = req.user_id;

  body_toSave.admins = [user_id];
  body_toSave.members = [user_id];

  // saveing to database and check if exist
  console.log(body_toSave);
  const new_group_model = new group_model(body_toSave);
  new_group_model
    .save()
    .then((data) => {
      // get group link
      new_group_model
        .getLink()
        .then((link) => {
          // updateing the link on the db
          group_model
            .findByIdAndUpdate({ _id: data._id }, { link })
            .then(() => {
              // updateing the user groups

              user_model
                .findByIdAndUpdate(
                  { _id: user_id },
                  {
                    $push: {
                      groups: data._id,
                    },
                  }
                )
                .then(() => {
                  res.status(200).send({ link: link });
                })
                .catch((err) => {
                  console.log(err);
                  res.status(422).send({ error_type: "mongooes", error: err });
                });
            })
            .catch((err) => {
              console.log(err);
              res.status(422).send({ error_type: "bcrypt", error: err });
            });
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
