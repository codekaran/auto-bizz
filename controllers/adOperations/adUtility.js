const sha1 = require("sha1");
const utils = require("../../helperFunctions/utility");
const db = require("../../data/databaseHandle");
const AD = require("../../models/ad");
const s3 = require("../../helperFunctions/s3_file_upload");

// uplaod images of the form contains image as well.
const uploadImages = async (req, sellerId) => {
  let imagesForS3 = [];
  let rejectedImages = [];
  console.log("the ad contains images as well");
  // check if valid
  for (let image of req.files) {
    let imageFormat = image["mimetype"].split("/")[1].toLowerCase();
    let imageSize = image.size;
    // checking for the image criteria(size and format)
    if (await utils.isImageValid(imageFormat, imageSize)) {
      // compress if size is more than 200 KB
      let compressedImage = await utils.compressImage(
        image.filename,
        imageSize,
        sellerId,
        "images-uploads"
      );
      imagesForS3.push(compressedImage);
    } else {
      rejectedImages.push(image.filename);
    }
  }
  // Deleting the invalid(size & format) images
  if (rejectedImages.length > 0) {
    console.log("Deleting the rejected images");
    await utils.deleteImages(rejectedImages);
  }
  // upload to s3
  urls = await s3.uploadMultipleFile(imagesForS3, "./images-uploads/");
  return urls;
};

// ad upload function for single and multiple ads.
const adUploadCommonLogic = async (res, req, adData, uploadType) => {
  let sellerId = req.sellerId;

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
    // if the req contains images as well
    if (req.files && req.files[0].mimetype != "application/zip") {
      // push the urls to json
      adData.images = await uploadImages(req, sellerId);
    }
    let adId = await db.storeAd(adData, sellerId);
    if (uploadType == "single") res.status(200).send("Ad Id: " + adId);
    else return adId;
  } else {
    if (uploadType == "single") res.status(200).send("Ad already exists");
    else return "Ad already exists";
  }
};

exports.adUploadCommonLogic = adUploadCommonLogic;
