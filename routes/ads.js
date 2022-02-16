var express = require("express");
var router = express.Router();

const { auth } = require("../controllers/authFunctions");
const { sellerAuth } = require("../controllers/authFunctions");

const {
  handleAdUpload,
} = require("../controllers/adOperations/singleAdUpload");
const {
  handleMultipleAdUpload,
} = require("../controllers/adOperations/zipUpload");
const { fetchSellerAds } = require("../controllers/adOperations/fetchAds");
const { deleteSellerAds } = require("../controllers/adOperations/deleteAds");

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

router.get("/test", (req, res) => {
  console.log("test");
  try {
    for (let i = 0; i <= 5; i++) {
      try {
        if (i == 0) {
          throw "first eror";
        }
        console.log(i);
      } catch (error) {
        console.log("inner error");
      }
    }
  } catch (error) {
    console.log("outer error");
  }
});

module.exports = router;
