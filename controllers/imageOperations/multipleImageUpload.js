const utils = require("../../helperFunctions/utility");
const AD = require("../../models/ad");
const db = require("../../data/databaseHandle");

// ***************** upload multiple images using multer *****************

const handleMultipleUpload = async (req, res) => {
  let adId = req.params.adId;
  let sellerId = req.params.sellerId;
  if (req.files) {
    console.log(req.files);
    try {
      console.log("hello1");
      let imagesUploadedOnServer = [];
      let imagesForS3 = [];
      let rejectedImages = [];
      for (let image of req.files) {
        console.log("hello2");
        let imageFormat = image["mimetype"].split("/")[1].toLowerCase();
        let imageSize = image.size;
        // checking for the image criteria(size and format)
        if (await utils.isImageValid(imageFormat, imageSize)) {
          console.log("hello3");

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

      // checking if the ad id belong to the seller
      if (await utils.recordExists({ id: adId, sellerId: sellerId }, AD)) {
        // pushing the image ref in the data base
        console.log("hello4");
        console.log("ad belongs");
        await db.addImagesToAd(adId, imagesForS3, res, "upload");
      } else {
        // delete images from the server when ad id is invalid
        await utils.deleteImages(imagesForS3);
        res.status(400).send("Invalid Ad Id");
      }
    } catch (error) {
      console.log(error);
      res.send(error);
    }
  } else {
    res.send("No images were uploaded");
  }
};

exports.handleMultipleUpload = handleMultipleUpload;
