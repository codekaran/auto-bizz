const utils = require("../helperFunctions/utility");
const AD = require("../models/ad");
const s3 = require("../helperFunctions/s3_file_upload");
const db = require("../data/databaseHandle");

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
