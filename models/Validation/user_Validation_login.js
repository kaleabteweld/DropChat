const joi = require("joi");

const user_Validation_Schema = joi.object({
  email: joi.string().email().min(4).max(100).required(),
  pass: joi.string().min(4).max(1024).required(),
});

function user_Validation(data) {
  return user_Validation_Schema.validate(data);
}

module.exports = user_Validation;
