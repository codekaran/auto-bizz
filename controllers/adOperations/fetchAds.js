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
// ***********************  returns single/all ads *************************
const fetchSellerAds = async (req, res) => {
  try {
    let data = {};
    // if adID exists fetch single ad
    if (req.params.adId) {
      data = await db.fetchSingleAd(req.params.adId);
      data.images = await getPresignedURL(data.images);
    }
    // else fetch all the ads of seller id
    else {
      console.log("fetching ads for seller Id ", req.params.sellerId);
      data = await db.fetchAllAdOfSeller(req.params.sellerId);
      for (let record of data) {
        record.images = await getPresignedURL(record.images);
      }
    }
    res.status(200).send(data);
  } catch (error) {
    console.log(error);
    res.status(500).send("Somethig  went wrong");
  }
};
exports.fetchSellerAds = fetchSellerAds;

// ***********************  returns /all ads *************************20220720163528423
const fetchAllAds = async (req, res) => {
  try {
    console.log("fetch all ads");
    let data = {};
    data = await db.fetchAllAds();
    // const s3 = new AWS.S3({ signatureVersion: "v4", region: "eu-central-1" });
    for (let record of data) {
      record.images = await getPresignedURL(record.images);
      // console.log(record.images);
      // let signedURLImages = [];
      // for (let image of record.images) {
      //   // extracting the image name from url
      //   let imageName = image.split("/").pop();
      //   let out = await s3.getSignedUrl("getObject", {
      //     Bucket: "autobizz",
      //     Key: imageName,
      //     Expires: 5,
      //   });
      //   signedURLImages.push(out);
      //   console.log(out);
      // }
      // record.images = signedURLImages;
    }
    console.log(data);

    res.status(200).send(data);
  } catch (error) {
    console.log(error);
    res.status(200).send("Somethig  went wrong");
  }
};
exports.fetchAllAds = fetchAllAds;
