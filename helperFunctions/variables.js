const multer = require("multer");
const fs = require("fs");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    if (
      file.mimetype === "image/jpg" ||
      file.mimetype === "image/jpeg" ||
      file.mimetype === "image/png"
    ) {
      console.log("$$$$$$$$$$inside multer variable setting " + req);
      if (!fs.existsSync("images-uploads/")) {
        fs.mkdirSync("images-uploads/", {
          recursive: true,
        });
      }
      cb(null, "images-uploads/");
    }
    if (file.mimetype === "application/zip") {
      if (!fs.existsSync("zip-uploads/")) {
        fs.mkdirSync("zip-uploads/", {
          recursive: true,
        });
      }
      cb(null, "zip-uploads/");
    }
  },
  filename: function (req, file, cb) {
    cb(null, (+new Date()).toString(36) + file.originalname);
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
    cb(null, (+new Date()).toString(36) + file.originalname);
  },
});

exports.zipStorage = zipStorage;
