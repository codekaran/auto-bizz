// const mongoDB = require("../data/databaseManipulation");
// const SellerDetails = require("../models/sellerDetails");
// const AD = require("../models/ad");
// const db = require("../data/databaseHandle");

// deletes ad
const deleteSellerAds = async (req, res) => {
  try {
    let data = {};
    // if adID exists delete single ad
    if (req.params.adId) {
      data = await mongoDB.deleteDataById(req.params.adId, "_id", AD);
    } else {
      res.send("Please provide an AD ID").status(400);
    }
    res.send(data).status(200);
  } catch (error) {
    console.log(error);
    res.send("Somethig  went wrong").status(500);
  }
};
exports.deleteSellerAds = deleteSellerAds;
