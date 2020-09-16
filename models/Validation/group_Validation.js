const joi = require("joi");

const group_Validation_Schema = joi.object({
  name: joi.string().min(4).max(60).required(),
  bio: joi.string().min(4).max(255).required(),
  img: joi.string().min(4).max(2000),
});

function group_Validation(data) {
  return group_Validation_Schema.validate(data);
}

module.exports = group_Validation;
