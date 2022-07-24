const db = require("../../data/databaseHandle");
const { recordExists } = require("../../helperFunctions/utility");
const AWS = require("aws-sdk");

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

// ***********************  returns /all ads *************************20220720163528423
const fetchAllAds = async (req, res) => {
  try {
    console.log("fetch all ads");
    let data = {};
    data = await db.fetchAllAds();
    const s3 = new AWS.S3({ signatureVersion: "v4", region: "eu-central-1" });
    for (let record of data) {
      console.log(record.images);
      let signedURLImages = [];
      for (let image of record.images) {
        // extracting the image name from url
        let imageName = image.split("/").pop();
        let out = await s3.getSignedUrl("getObject", {
          Bucket: "autobizz",
          Key: imageName,
          Expires: 5,
        });
        signedURLImages.push(out);
        console.log(out);
      }
      record.images = signedURLImages;
    }
    console.log(data);

    res.status(200).send(data);
  } catch (error) {
    console.log(error);
    res.status(200).send("Somethig  went wrong");
  }
};
exports.fetchAllAds = fetchAllAds;
