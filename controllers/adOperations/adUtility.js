const sha1 = require("sha1");
const utils = require("../../helperFunctions/utility");
const db = require("../../data/databaseHandle");
const AD = require("../../models/ad");

// ad upload function for single and multiple ads.
const adUploadCommonLogic = async (res, req, adData, uploadType) => {
  let sellerId = req.params.sellerId;
  console.log("#########uploading#########");
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

exports.adUploadCommonLogic = adUploadCommonLogic;
