const db = require("../../data/databaseHandle");
const { recordExists } = require("../../helperFunctions/utility");
const AWS = require("aws-sdk");

const getPresignedURL = async (imageUrl) => {
  let signedURLImages = [];
  const s3 = new AWS.S3({ signatureVersion: "v4", region: "eu-central-1" });
  for (let image of imageUrl) {
    // extracting the image name from url
    let imageName = image.split("/").pop();
    let out = await s3.getSignedUrl("getObject", {
      Bucket: "autobizz",
      Key: imageName,
      Expires: 3600,
    });
    signedURLImages.push(out);
  }
  return signedURLImages;
};
// ***********************  returns all ad *************************
const fetchSingleAd = async (req, res) => {
  try {
    let data = {};
    data = await db.fetchSingleAd(req.params.adId);
    data.images = await getPresignedURL(data.images);
    res.status(200).send(data);
  } catch (error) {
    console.log(error);
    res.status(500).json({ msg: "Somethig  went wrong" });
  }
};
exports.fetchSingleAd = fetchSingleAd;

// ***********************  returns all ads of user *************************
const fetchSellerAds = async (req, res) => {
  try {
    //fetch all the ads of seller id
    console.log("fetching ads for seller Id ", req.sellerId);
    data = await db.fetchAllAdOfSeller(req.sellerId);
    for (let record of data) {
      record.images = await getPresignedURL(record.images);
    }
    res.status(200).send(data);
  } catch (error) {
    console.log(error);
    res.status(500).json({ msg: "Something  went wrong" });
  }
};
exports.fetchSellerAds = fetchSellerAds;

// ***********************  returns /all ads *************************20220720163528423
const fetchAllAds = async (req, res) => {
  try {
    let data = {};
    data = await db.fetchAllAds();
    const s3 = new AWS.S3({ signatureVersion: "v4", region: "eu-central-1" });
    for (let record of data) {
      record.images = await getPresignedURL(record.images);
    }
    res.status(200).send(data);
  } catch (error) {
    console.log(error);
    res.status(500).send("Somethig  went wrong");
  }
};
exports.fetchAllAds = fetchAllAds;
