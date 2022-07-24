require("dotenv").config();
const util = require("util");
const fs = require("fs");

const unlinkFile = util.promisify(fs.unlink);
const AWS = require("aws-sdk");

const accessKeyId = process.env.aws_access_key_id;
const secretAccessKey = process.env.aws_secret_access_key;
const bucket_name = "autobizz";
const region = "us-east-1";

AWS.config.update({
  region,
  accessKeyId,
  secretAccessKey,
});

const s3 = new AWS.S3();

// upload single image to files

async function uploadSingleFile(pathOfFile, fileName) {
  let filePath = pathOfFile + fileName;
  console.log("uploading the image to s3 bucket");
  const fileStream = fs.createReadStream(filePath);
  console.log(typeof fileStream);
  const uploadParams = {
    Bucket: bucket_name,
    Body: fileStream,
    Key: fileName,
  };
  let status = await s3.upload(uploadParams).promise();
  console.log("status of s3 upload");
  console.log(status);
  // delete the file after loading
  await unlinkFile(filePath);
  console.log("image uploaded");
  return status.Location;
}
exports.uploadSingleFile = uploadSingleFile;

// upload multiple images
// files - list of name of the images to be uploaded
// path - where the image is uploaded on server
async function uploadMultipleFile(files, path) {
  let remainingList = [];
  let imageURLS = [];
  let totalList = [];
  for (let file of files) {
    totalList.push(file);
  }
  console.log("total ");
  console.log(totalList);
  for (let file of files) {
    console.log(file);
    const fileStream = fs.createReadStream(path + file);
    const uploadParams = {
      Bucket: bucket_name,
      Body: fileStream,
      Key: file,
    };

    let status = await s3.upload(uploadParams).promise();
    console.log("status of s3 upload");
    imageURLS.push(status.Location);
    remainingList = totalList.filter((element) => element != file);

    // delete the file after loading
    await unlinkFile(path + file);
    totalList = remainingList;
  }
  console.log("image uploaded");
  console.log(imageURLS);
  return imageURLS;
}
exports.uploadMultipleFile = uploadMultipleFile;

async function deleteObjects(imageList) {
  console.log("Deleting images from S3");
  let objects = [];
  for (let img of imageList) {
    let imageName = img.split("/")[img.split("/").length - 1];
    objects.push({ Key: imageName });
  }
  console.log(objects);
  const deleteParams = {
    Bucket: bucket_name,
    Delete: {
      Objects: objects,
    },
  };
  let status = await s3.deleteObjects(deleteParams).promise();
  console.log(status);
}

exports.deleteObjects = deleteObjects;

// get the list of images
function getObjectList(res) {
  const params = {
    Bucket: bucket_name,
  };
  s3.listObjects(params, function (err, data) {
    if (err) {
      console.log(err, err.stack);
    } else {
      let list = data.Contents;
      let keyList = [];
      for (let l of list) {
        keyList.push(
          "https://" + bucket_name + ".s3.ap-south-1.amazonaws.com/" + l.Key
        );
      }
      console.log(keyList);
      // successful response
      res.send(keyList);
    }
  });
}
exports.getObjectList = getObjectList;
