var express = require("express");
var router = express.Router();
const AWS = require("aws-sdk");
const s3 = new AWS.S3({ signatureVersion: "v4", region: "eu-central-1" });
const { auth } = require("../controllers/authFunctions");
const { sellerAuth } = require("../controllers/authFunctions");

const {
  handleAdUpload,
} = require("../controllers/adOperations/singleAdUpload");
const {
  handleMultipleAdUpload,
} = require("../controllers/adOperations/zipUpload");
const {
  fetchSellerAds,
  fetchSingleAd,
} = require("../controllers/adOperations/fetchAds");
const { deleteSellerAds } = require("../controllers/adOperations/deleteAds");
const { fetchAllAds } = require("../controllers/adOperations/fetchAds");
const { S3 } = require("aws-sdk");

// ********************* Ad Operations *******************

// create bulk ads
router.post("/:sellerId/bulkads", auth, (req, res) => {
  handleMultipleAdUpload(req, res);
});

// create Ad
router.post("/ads", auth, sellerAuth, (req, res) => {
  handleAdUpload(req, res);
});
//----route change karan
// fetch  single ad
router.get("/ad/:adId", auth, (req, res) => {
  fetchSingleAd(req, res);
});
//--route change karan
// fetch ads of a user
// protected
router.get("/userAds", sellerAuth, (req, res) => {
  fetchSellerAds(req, res);
});
//public
// fetch all ads based on query -- working
router.get("/ads", auth, (req, res) => {
  fetchAllAds(req, res);
});

// delete ad this is mongo // need to work in this.
router.delete("/ad", auth, sellerAuth, (req, res) => {
  deleteSellerAds(req, res);
});

router.get("/test", async (req, res) => {
  console.log("test");
  let params = {
    Bucket: "autobizz",
    Key: "1l5qoacet.jpeg",
  };
  let out = await s3.getSignedUrl("getObject", params);
  console.log(out);
});

module.exports = router;
