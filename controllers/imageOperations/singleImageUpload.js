const fs = require("fs");
const utils = require("../../helperFunctions/utility");
const db = require("../../data/databaseHandle");

// ***************** upload single binary image file *****************
const handleSingleUpload = async (req, res) => {
  console.log("Uploading the binary image");
  let imageName = (+new Date()).toString(36) + ".jpg";
  try {
    let imageFormat = req.headers["content-type"].split("/")[1].toLowerCase();
    let imageSize = req.body.length;
    console.log("image Size : ", imageSize / 1000 + " kb");
    if (utils.isImageValid(imageFormat, imageSize)) {
      console.log("image is valid");
      fs.writeFileSync("./uploads/" + imageName, req.body);
      let finalImage = await utils.compressImage(imageName, imageSize);
      console.log("outside the function");
      let url = await s3.uploadSingleFile("./uploads/", finalImage);
      await db.saveNonAssociatedImages(url);
      res.status(200).send({ baseUrl: url });
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
