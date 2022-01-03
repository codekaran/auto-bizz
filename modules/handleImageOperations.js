const fs = require("fs");
const utils = require("../helperFunctions/utility");
const AD = require("../models/ad");
const mongoDB = require("../data/databaseManipulation");
const s3 = require("../helperFunctions/s3_file_upload");
const db = require("../data/databaseHandle");
const nonAssociatedImages = require("../models/nonAssociatedImages");
const variables = require("../helperFunctions/variables");

// ***************** multer config *****************
const multer = require("multer");
// const nonAssociatedImagesSchema = require("../models/nonAssociatedImages");

const upload = multer({ storage: variables.storage }).array("image"); // Form data should have image as fieldname

// ***************** upload single binary image file *****************
const handleSingleUpload = async (req, res) => {
  console.log("Uploading the binary image");
  let imageName = (+new Date()).toString(36) + ".jpg";
  try {
    let imageFormat = req.headers["content-type"].split("/")[1].toLowerCase();
    let imageSize = req.body.length;
    if (utils.isImageValid(imageFormat, imageSize)) {
      // generating name from timestamp.

      fs.writeFileSync("./uploads/" + imageName, req.body);

      let url = await s3.uploadSingleFile(imageName);
      await db.saveNonAssociatedImages(url);
      res.send({ baseUrl: url }).status(200);
    } else {
      res.send("Please Upload image following the proper criteria").status(300);
    }
  } catch (error) {
    await utils.deleteImages([imageName]);
    console.log(error);
    res.status(500).send("Something went wrong");
  }
};

exports.handleSingleUpload = handleSingleUpload;

// ***************** upload multiple images using multer *****************

const handleMultipleUpload = async (req, res) => {
  let adId = req.params.adId;
  let sellerId = req.params.sellerId;

  await upload(req, res, async (err) => {
    if (err instanceof multer.MulterError) {
      res.send(err);
    } else if (err) {
      console.log(err);
      res.send(err);
    }
    // Everything went fine.
    else if (req.files) {
      console.log(req.files);
      try {
        let imagesUploadedOnServer = [];
        let imagesForS3 = [];
        let rejectedImages = [];
        for (let image of req.files) {
          let imageFormat = image["mimetype"].split("/")[1].toLowerCase();
          let imageSize = image.size;
          // checking for the image criteria(size and format)
          if (await utils.isImageValid(imageFormat, imageSize)) {
            imagesForS3.push(image.filename);
          } else {
            rejectedImages.push(image.filename);
          }
        }

        // Deleting the invalid(size & format) images
        if (rejectedImages.length > 0) {
          console.log("Deleting the rejected images");
          await utils.deleteImages(rejectedImages);
        }

        // checking if the ad id belong to the seller
        if (await utils.recordExists({ id: adId, sellerId: sellerId }, AD)) {
          // pushing the image ref in the data base
          console.log("ad belongs exists");
          await db.addImagesToAd(adId, imagesForS3, res, "upload");
        } else {
          // delete images from the server when ad id is invalid
          await utils.deleteImages(imagesForS3);
          res.send("Invalid Ad Id").status(400);
        }
      } catch (error) {
        console.log(error);
        res.send(error);
      }
    } else {
      res.send("No images were uploaded");
    }
  });
};

exports.handleMultipleUpload = handleMultipleUpload;

// ***************** delete image *****************
const handleDelete = async (req, res) => {
  try {
    let sellerId = req.params.sellerId;
    let adId = req.params.adId;
    // check if ad belongs to seller
    if (await utils.adBelongsToSeller(AD, adId, sellerId)) {
      // remove the images from server and data base
      let imageList = await db.deleteImagesFromDB(adId);
      console.log("images delete from DB ", imageList);
      // await utils.deleteImages(imageList);
      await s3.deleteObjects(imageList);

      res.send("Images deleted").status(200);
    } else {
      res.send("Invalid Ad Id").status(400);
    }
  } catch (error) {
    console.log(error);
    res.send("something went wrong please try uploading");
  }
};

exports.handleDelete = handleDelete;

// ***************** associate image *****************
const handleAssociate = async (req, res) => {
  try {
    let sellerId = req.params.sellerId;
    let adId = req.params.adId;
    // check if the image exists on server.
    let result = await utils.checkImageExists(req, nonAssociatedImages);
    if (result.status) {
      // check if ad belongs to seller
      if (await utils.adBelongsToSeller(AD, adId, sellerId)) {
        // add the images to the ad
        let images = result.imagesAvailable;
        console.log("images to add to database:");
        console.log(images);
        await db.addImagesToAd(adId, images, res, "associate");
      } else {
        res.send("Invalid Ad Id").status(400);
      }
    } else {
      res.send("Image does not exists").status(400);
    }
  } catch (error) {
    if (error.name == "CastError") {
      res.send("Invalid ad ID");
    } else {
      console.log(error);
      res.send("something went wrong").status(500);
    }
  }
};

exports.handleAssociate = handleAssociate;
