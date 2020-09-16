const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const group_Schema = mongoose.Schema({
  img: {
    type: String,
    required: false,
  },
  name: {
    type: String,
    required: true,
    unique: true,
  },
  admins: {
    type: [mongoose.Types.ObjectId],
    required: false,
  },
  members: {
    type: [mongoose.Types.ObjectId],
    required: false,
  },
  bio: {
    type: String,
    default: " ",
    required: false,
  },
  time: {
    type: Date,
    default: Date.now(),
  },
});

group_Schema.methods.getLink = async function () {
  const data = this._id;

  return new Promise(function (resolve, reject) {
    bcrypt
      .genSalt(10)
      .then((salt) => {
        bcrypt
          .hash(String(data), salt)
          .then((done) => {
            done = Buffer.from(String(done)).toString("base64");
            resolve(done);
          })
          .catch((err) => {
            reject(err);
          });
      })
      .catch((err) => {
        reject(err);
      });
  });
};

const group_model = mongoose.model("group", group_Schema);

module.exports = group_model;
