var express = require("express");
var router = express.Router();

const { auth } = require("../modules/authFunctions");
const { sellerAuth } = require("../modules/authFunctions");

// generating the database schema if not generated
require("../data/generateDatabaseDesign");

// helper functions
const { handleUserRegisteration } = require("../modules/handleSellerUpload");
const imageOperations = require("../modules/handleImageOperations");
const { handleAdUpload } = require("../modules/handleAdOperations");
const { handleMultipleAdUpload } = require("../modules/handleAdOperations");
const { fetchSellerAds } = require("../modules/handleAdOperations");
const { deleteSellerAds } = require("../modules/handleAdOperations");

// ********************* Image Operations ********************

// stock manager - with ability to upload the ads to various platforms

// upload multiple
router.put(
  "/:sellerId/ads/:adId/images",
  auth,
  sellerAuth,
  (req, res, next) => {
    imageOperations.handleMultipleUpload(req, res);
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

// ********************* User Operations *******************

// user registeration
router.post("/register", auth, async (req, res, next) => {
  handleUserRegisteration(req, res);
});

router.post("/seller-api/sellers/:id/ads", auth, (req, res) => {
  console.log(req.params.id);
  console.log("test");
  res.send("helo");
});

router.post("/test", (req, res) => {
  console.log(req.body);
  res.send("ok");
});

// ********************* Ad Operations *******************

// create bulk ads
router.post("/:sellerId/bulkads", auth, (req, res) => {
  handleMultipleAdUpload(req, res);
});

// create Ad
router.post("/:sellerId/ads", auth, sellerAuth, (req, res) => {
  handleAdUpload(req, res);
});

// fetch all or single ad
router.get("/createAd/:sellerId/ads/:adId", auth, sellerAuth, (req, res) => {
  fetchSellerAds(req, res);
});

// delete ad
router.delete("/createAd/:sellerId/ads/:adId", auth, sellerAuth, (req, res) => {
  deleteSellerAds(req, res);
});

module.exports = router;
