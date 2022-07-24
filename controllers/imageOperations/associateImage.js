const utils = require("../../helperFunctions/utility");
const AD = require("../models/ad");
const db = require("../../data/databaseHandle");
const nonAssociatedImages = require("../models/nonAssociatedImages");

// ***************** associate image *****************
const handleAssociate = async (req, res) => {
  try {
    let sellerId = req.params.sellerId;
    let adId = req.params.adId;
    // check if the image exists on S3 bucket.
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
