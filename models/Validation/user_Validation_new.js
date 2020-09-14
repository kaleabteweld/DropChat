const JoiPhoneNumberExtensions = require("joi-phone-number");
const joi = require("joi").extend(JoiPhoneNumberExtensions);

const user_Validation_Schema = joi.object({
  name: joi.string().min(4).max(60).required(),
  user_name: joi.string().min(4).max(60).required(),
  email: joi.string().email().min(4).max(100).required(),
  phone: joi.string().min(4).max(100).required(),
  pass: joi.string().min(4).max(1024).required(),
});

function user_Validation(data) {
  return user_Validation_Schema.validate(data);
}

module.exports = user_Validation;
