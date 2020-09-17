const multer = require("multer");
const path = require("path");

// set storage engine

const storage = multer.diskStorage({
  destination: "../../uploads",
  filename: function (req, file, cb) {
    cb(
      null,
      "group_img_" +
        file.filename +
        String(Date.now()) +
        path.extname(file.originalname)
    );
  },
});

// check file type
function check(file, cb) {
  const filetype = /jpeg|jpg|png|gif/;

  // check ext
  const extname = filetype.test(path.extname(file.originalname.toLowerCase()));
  // check mime
  const mime = filetype.test(path.extname(file.mimetype));

  if (extname && mime) {
    cb(null, true);
  } else {
    cb("img only");
  }
}

// init upload
const upload = multer({
  storage,
  // limits
  fileFilter: function (req, file, cb) {
    check(file, cb);
  },
}).single("img");

module.exports = upload;
