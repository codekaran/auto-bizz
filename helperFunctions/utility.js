const fs = require("fs");
const path = require("path");
const sharp = require("sharp");

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
// image size in kb
async function isImageValid(imageFormat, imageSize) {
  console.log("Checking the image size and image type");
  let result = false;
  // size is less than 2MB
  if (
    (imageFormat === "jpg" || imageFormat === "jpeg") &&
    imageSize <= 2000096
  ) {
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
// images - array of image names
async function deleteImages(images) {
  console.log("Deleting the images from server");
  console.log(images);
  for (let image of images) {
    fs.unlinkSync("./images-uploads/" + image);
  }
}
exports.deleteImages = deleteImages;

// ***************** compress image under 200 kb *****************
// inputImage - name of the image
// imageSize - in kb
// parent folder of images
const compressImage = async (inputImage, imageSize, sellerId, imageFolder) => {
  return new Promise((resolve, reject) => {
    if (imageSize > 200000) {
      console.log("image size is > 200 kb compressing it");
      const inputImagePath = path.join(
        __dirname,
        "../",
        imageFolder,
        inputImage
      );
      const ouputImage = sellerId
        ? sellerId + (+new Date()).toString(36) + ".jpeg"
        : (+new Date()).toString(36) + ".jpeg";
      const outputImagePath = path.join(
        __dirname,
        "../",
        imageFolder,
        ouputImage
      );
      const quality =
        imageSize < 0.5 * 1048576 ? 50 : imageSize < 1 * 1048576 ? 30 : 15;
      sharp(inputImagePath)
        .jpeg({
          quality: quality,
          chromaSubsampling: "4:4:4",
        })
        .toFile(outputImagePath, (err, info) => {
          if (err) {
            console.log(err);
            reject("Failed to compress image");
          } else {
            console.log("Compression successful");
            console.log("Size after compression ", info.size / 1000 + " kb");
            resolve(ouputImage);
            // delete the large image
            deleteImages([inputImage]);
          }
        });
    } else {
      resolve(inputImage);
    }
  });
};
exports.compressImage = compressImage;
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
