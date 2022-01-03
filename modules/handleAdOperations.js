const mongoDB = require("../data/databaseManipulation");
const SellerDetails = require("../models/sellerDetails");
const AD = require("../models/ad");
const db = require("../data/databaseHandle");
const utils = require("../helperFunctions/utility");
const decompress = require("decompress");
const sha1 = require("sha1");
const multer = require("multer");
const fs = require("fs");
const variables = require("../helperFunctions/variables");
const upload = multer({ storage: variables.zipStorage }).single("zip"); // Form data should have zip as fieldname

const adUploadCommonLogic = async (res, req, adData, uploadType) => {
  let sellerId = req.params.sellerId;
  console.log("#########uploading#########");
  console.log(adData);
  // chassis number or any other unique field
  let hashKey = sha1(
    adData.make + adData.constructionYear + adData.model + adData.mileage
  );
  // check if AD already exists based on above rows
  let adExists = await utils.recordExists(
    { importantColumnHashKey: hashKey },
    AD
  );
  if (!adExists) {
    console.log("Ad Does not exists");
    let adId = await db.storeAd(adData, sellerId);
    if (uploadType == "single") res.status(200).send("Ad Id: " + adId);
    else return adId;
  } else {
    if (uploadType == "single") res.status(200).send("Ad already exists");
    else return "Ad already exists";
  }
};

// ************************* Upload single ads ********************
const handleAdUpload = async (req, res) => {
  try {
    await adUploadCommonLogic(res, req, req.body, "single");
  } catch (error) {
    console.log(error);
    res.status(500).send("Somethig  went wrong");
  }
};
exports.handleAdUpload = handleAdUpload;

// ************************* Upload multiple ads ********************

const handleImageUpload = async (ad, sellerId) => {
  console.log("modifying images");
  if (ad.images.length > 0) {
    // adding a sleep time to rename the images
    const timer = (ms) => new Promise((res) => setTimeout(res, ms));
    console.log(ad.images);
    for (let image of ad.images) {
      console.log("renaming ", image);
      fs.renameSync(
        "./unzip-files/" + sellerId + "/" + image,
        "./unzip-files/" + sellerId + "/" + (+new Date()).toString(36) + ".jpg"
      );
      await timer(3000);
    }
  }
};

const handleMultipleAdUpload = async (req, res) => {
  try {
    upload(req, res, async function (err) {
      if (err instanceof multer.MulterError) {
        // A Multer error occurred when uploading.
        console.log(err);
      } else if (err) {
        // An unknown error occurred when uploading.
        console.log(err);
      }
      try {
        let sellerId = req.params.sellerId;
        console.log(req.file);
        // unzipping the files
        let files = await decompress(req.file.path, "unzip-files/" + sellerId);
        let adFile = {};
        // fetching the ads.json file from extracted files.
        for (let file of files) {
          if (file.path == "ads.json") {
            adFile = file;
            break;
          }
        }
        let adData = JSON.parse(adFile.data);
        // stroing the ad one by one
        for (let ad of adData) {
          ad = await handleImageUpload(ad, sellerId);
          // let result = await adUploadCommonLogic(res, req, ad, "multiple");
          // console.log(result);
        }
        // Everything went fine.
      } catch (error) {
        console.log(error);
        res.status(500).send("Somethig  went wrong");
      }
    });
  } catch (error) {
    console.log(error);
    res.status(500).send("Somethig  went wrong");
  }
};
exports.handleMultipleAdUpload = handleMultipleAdUpload;

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
