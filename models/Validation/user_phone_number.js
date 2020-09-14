const Nexmo = require("nexmo");
const config = require("config");

const nexmo = new Nexmo({
  apiKey: config.get("nexmo_api_key"),
  apiSecret: config.get("nexmo_apiSecret"),
});

module.exports = async function cheak_number(number) {
  return new Promise(function (resolve, reject) {
    nexmo.numberInsight.get(
      { level: "basic", number: number },
      (error, result) => {
        if (error) {
          reject(error);
        } else {
          resolve(result);
        }
      }
    );
  });
};
