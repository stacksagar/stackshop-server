const multer = require("multer");
const path = require("path");
const upload = multer({
  storage: multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, path.join(path.dirname(__dirname), "uploads"));
    },
    filename: (req, file, cb) => {
      cb(
        null,
        Date.now() +
          "-" +
          Math.random().toString().split(".")[1] +
          "-" +
          file.originalname.split(" ").join("-")
      );
    },
  }),
});

module.exports = upload;
