var express = require("express");
var router = express.Router();

const { auth } = require("../controllers/authFunctions");
const { sellerAuth } = require("../controllers/authFunctions");
const imageOperations = require("../controllers/handleImageOperations");
const {
  handleMultipleUpload,
} = require("../controllers/imageOperations/multipleImageUpload");

// ********************* Image Operations ********************

// stock manager - with ability to upload the ads to various platforms

// upload multiple
router.put(
  "/:sellerId/ads/:adId/images",
  auth,
  sellerAuth,
  (req, res, next) => {
    handleMultipleUpload(req, res);
  }
);

// upload single image
router.post("/images", auth, (req, res) => {
  imageOperations.handleSingleUpload(req, res);
});

// delete image
router.delete("/:sellerId/ads/:adId/images", auth, (req, res) => {
  imageOperations.handleDelete(req, res);
});

// associate image which is uploaded by single upload
router.put(
  "/associate/:sellerId/ads/:adId/images",
  auth,
  sellerAuth,
  (req, res) => {
    imageOperations.handleAssociate(req, res);
  }
);

module.exports = router;
