const mongoDB = require("../data/databaseManipulation");
const {
  uploadSingleFile,
  uploadMultipleFile,
  getObjectList,
} = require("../helperFunctions/s3_file_upload");

const handleCarUpload = async (req, uploadType) => {
  // let carData = JSON.parse(JSON.stringify(req.body.description));
  if (uploadType === "single") {
    console.log("image to upload : " + req.file.originalname);
    await uploadSingleFile(req.file);
  } else if (uploadType === "multiple") {
    await uploadMultipleFile(req.files);
  } else {
    console.log("invalid input");
  }

  // await mongoDB.storeCarDetails(carData);
};
exports.handleCarUpload = handleCarUpload;

// multiple
// try {
//   console.log(req.files.length);
//   if (req.files.length > 1) {
//     await handleCarUpload(req, "multiple");
//     res.status(200).send("data uploaded");
//   } else {
//     res.status(400).send("Images count should be more than 1");
//   }
// } catch (error) {
//   res.status(400).send("something went wrong please retry");
//   console.log(error);
// }

// single
// router.post(
//   "/uploadSingleImage",
//   auth,
//   upload.single("image"),
//   async function (req, res, next) {
//     try {
//       if (req.file) {
//         await handleCarUpload(req, "single");
//         res.status(200).json("data uploaded");
//       } else {
//         res.status(400).json("please upload images also");
//       }
//     } catch (error) {
//       res.status(400).send("something went wrong please retry");
//       console.log(error);
//     }
//   }
// );
