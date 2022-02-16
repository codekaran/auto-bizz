const adUtils = require("./adUtility");
const utils = require("../../helperFunctions/utility");
const decompress = require("decompress");
const multer = require("multer");
const fs = require("fs");
const variables = require("../../helperFunctions/variables");
const upload = multer({ storage: variables.zipStorage }).single("zip"); // Form data should have zip as fieldname

// ************************* Upload multiple ads ********************
// renames the images name in ad file => upload it to s3 => returns updated ad.
const handleImageUpload = async (ad, sellerId) => {
  console.log("modifying images");
  if (ad.images.length > 0) {
    // adding a sleep time to rename the images
    const timer = (ms) => new Promise((res) => setTimeout(res, ms));
    console.log(ad.images);
    let i = 0;
    for (let image of ad.images) {
      console.log("renaming ", image);
      let newName = sellerId + (+new Date()).toString(36) + ".jpg";
      fs.renameSync(
        "./unzip-files/" + sellerId + "/" + image,
        "./unzip-files/" + sellerId + "/" + newName
      );
      await timer(10);
      let s3Url = await uploadImageToS3(
        "./unzip-files/" + sellerId + "/",
        newName
      );
      // changing the name of the image in file
      ad.images[i] = s3Url;
      i++;
    }
    console.log(ad);
    return ad;
  }
};

// uploads zipped images to s3
const uploadImageToS3 = async (pathOfFile, fileName) => {
  let imageSize = fs.statSync(path).size / 1000;
  console.log("image Size : ", imageSize + " kb");
  if (utils.isImageValid("jpg", imageSize)) {
    console.log("image is valid");
  }

  return "test/path";
};

const handleMultipleAdUpload = async (req, res) => {
  try {
    console.log(req.files);
    // // uploading zip file using multer
    // upload(req, res, async function (err) {
    //   if (err instanceof multer.MulterError) {
    //     // A Multer error occurred when uploading.
    //     console.log(err);
    //   } else if (err) {
    //     // An unknown error occurred when uploading.
    //     console.log(err);
    //   }
    //   // added try catch for inner function
    //   try {
    //     let sellerId = req.params.sellerId;
    //     console.log(req.file);
    //     // unzipping the files
    //     let files = await decompress(req.file.path, "unzip-files/" + sellerId);
    //     let adFile = {};
    //     // fetching the ads.json file from extracted files.
    //     for (let file of files) {
    //       if (file.path == "ads.json") {
    //         adFile = file;
    //         break;
    //       }
    //     }
    //     let adData = JSON.parse(adFile.data);
    //     // storing the ad one by one
    //     let adNumber = 1;
    //     let adUploadFinalStatus = {};
    //     for (let ad of adData) {
    //       // try catch block to check if any of the ad upload fails
    //       try {
    //         ad = await handleImageUpload(ad, sellerId);
    //         let result = await adUtils.adUploadCommonLogic(
    //           res,
    //           req,
    //           ad,
    //           "multiple"
    //         );
    //         console.log(
    //           "$$$$$$$$$$$$$$$$$$$ upload result %%%%%%%%%%%%%%%%%%%"
    //         );
    //         adUploadFinalStatus["ad " + adNumber] = result;
    //       } catch (error) {
    //         console.log("error in the loop ", adNumber);
    //         console.log(error);
    //         adUploadFinalStatus["ad " + adNumber] = "something went wrong";
    //       }
    //       adNumber += 1;
    //     }
    //     res.status(500).send(adUploadFinalStatus);
    //   } catch (error) {
    //     console.log("error in uploading");
    //     console.log(error);
    //     res.status(500).send("Somethig  went wrong");
    //   }
    // });
  } catch (error) {
    console.log(error);
    res.status(500).send("Somethig  went wrong");
  }
};
exports.handleMultipleAdUpload = handleMultipleAdUpload;
