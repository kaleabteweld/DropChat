const jwt = require("jsonwebtoken");
const config = require("config");

module.exports = function (req, res, next) {
  const payload = req.header("x-auth-token");
  try {
    req.user_id = jwt.decode(payload, config.get("jwt")).id;
    next();
  } catch (error) {
    res.status(404).send({
      error_type: "token error",
      error: "invalid token",
    });
  }
};
