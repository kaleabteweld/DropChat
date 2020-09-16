const { string } = require("joi");
const mongoose = require("mongoose");

const user_Schema = mongoose.Schema({
  img: {
    type: String,
    required: false,
  },
  name: {
    type: String,
    required: true,
  },
  user_name: {
    type: String,
    required: false,
    unique: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  phone: {
    type: String,
    unique: true,
    sparse: true,
    default: " ",
  },
  region: {
    type: Object,
    required: false,
  },
  pass: {
    type: String,
    required: true,
  },
  dm: {
    type: [mongoose.Types.ObjectId],
  },
  groups: {
    type: [mongoose.Types.ObjectId],
  },
  channel: {
    type: [mongoose.Types.ObjectId],
  },
  time: {
    type: Date,
    default: Date.now(),
  },
});

const user_model = mongoose.model("user", user_Schema);

module.exports = user_model;
