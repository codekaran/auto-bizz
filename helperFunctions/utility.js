const fs = require("fs");
const path = require("path");

// function returns true/false based on primary key value in table.
// input PK value, model to searched
async function idExists(id, model) {
  let result = await model.findByPk(id);
  if (result) {
    return true;
  }
  return false;
}

exports.idExists = idExists;

// function returns true/false based on matched field value in table.
// input key value object, model to searched
async function recordExists(keyValue, model) {
  let result = await model.findOne({ where: keyValue });
  if (result) {
    return true;
  }
  return false;
}

exports.recordExists = recordExists;

// checking the image size and image type.
async function isImageValid(imageFormat, imageSize) {
  console.log("Checking the image size and image type");
  // let imageFormat = req.headers["content-type"].split("/")[1].toLowerCase();
  let result = false;
  // let imageSize = req.body.length;
  if (
    (imageFormat === "jpg" || imageFormat === "jpeg") &&
    imageSize <= 2097152
  ) {
    console.log("pass");
    result = true;
  }
  return result;
}

exports.isImageValid = isImageValid;

async function checkImageExists(req, model) {
  let flag = 0;
  let imagesAvailable = [];
  console.log("checking if the images exists in non assiciated image table");
  for (let image of req.body.images) {
    if (await model.findByPk(image.ref)) {
      imagesAvailable.push(image.ref);
      flag = 1;
    }
  }
  if (flag == 1) {
    return { status: true, imagesAvailable };
  }
  return { status: false, imagesAvailable };
}
exports.checkImageExists = checkImageExists;

// check if the ad belongs to the seller
async function adBelongsToSeller(model, adId, sellerId) {
  console.log("checking if the ad belongs to seller");
  let res = await model.findByPk(adId);
  // if the ad id exists
  if (res) {
    let adSellerId = res.sellerId;

    if (adSellerId == sellerId) {
      console.log(true);
      return true;
    }
    console.log(false);
    return false;
  }
  return false;
}
exports.adBelongsToSeller = adBelongsToSeller;

// Delete images
async function deleteImages(images) {
  console.log("Deleting the images from server");
  console.log(images);
  for (let image of images) {
    fs.unlinkSync("./uploads/" + image);
  }
}
exports.deleteImages = deleteImages;

// move images
// async function moveImages(sellerId, adId, images) {
//   console.log("moving the images");
//   console.log(images);
//   for (let image of images) {
//     await cpFile(
//       "./uploads",
//       "./uploads/" + sellerId + "/" + adId + "/" + image
//     );
//     console.log("copied : ", image);
//     fs.unlinkSync("./uploads/" + image);
//   }
// }
// exports.moveImages = moveImages;
