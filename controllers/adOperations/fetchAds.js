const db = require("../../data/databaseHandle");

// ***********************  returns single/all ads *************************
const fetchSellerAds = async (req, res) => {
  try {
    let data = {};
    // if adID exists fetch single ad
    if (req.params.adId) {
      data = await db.fetchSingleAd(req.params.adId);
    }
    // else fetch all the ads of seller id
    else {
      data = await db.fetchAllAd(sellerId);
    }
    res.status(200).send(data);
  } catch (error) {
    console.log(error);
    res.status(200).send("Somethig  went wrong");
  }
};
exports.fetchSellerAds = fetchSellerAds;
