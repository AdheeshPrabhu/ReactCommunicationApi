const multer = require("multer");
const path = require("path");
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/"); // Destination folder
  },
  filename: (req, file, cb) => {
    let newFilename = Date.now() + "-" + file.originalname;
    cb(null, newFilename); // Rename file
  },
});

const multerUpload = multer({ storage: storage });

module.exports = {
  multerUpload,
};
