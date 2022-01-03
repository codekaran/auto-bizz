const multer = require("multer");
const fs = require("fs");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    if (!fs.existsSync("uploads/")) {
      fs.mkdirSync("uploads/", {
        recursive: true,
      });
    }
    cb(null, "uploads/");
  },
  filename: function (req, file, cb) {
    cb(null, (+new Date()).toString(36) + ".jpg");
  },
});

exports.storage = storage;

const zipStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    if (!fs.existsSync("zip-uploads/")) {
      fs.mkdirSync("zip-uploads/", {
        recursive: true,
      });
    }
    cb(null, "zip-uploads/");
  },
  filename: function (req, file, cb) {
    cb(null, (+new Date()).toString(36) + ".zip");
  },
});

exports.zipStorage = zipStorage;
