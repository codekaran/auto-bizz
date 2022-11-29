const db = require("../data/sqlConnection").connection;
const Seller = require("../models/sellerDetails");
const sha1 = require("sha1");
const AD = require("../models/ad");
const utils = require("../helperFunctions/utility");
const s3 = require("../helperFunctions/s3_file_upload");
const nonAssociatedImages = require("../models/nonAssociatedImages");

// ************************ Save Operations ********************

async function storeSellerDetails(req) {
  console.log("stroing the pass : ", req.body.password);
  sellerData = req.body;
  let result = await Seller.create({
    sellerType: sellerData.sellerType,
    firstName: sellerData.fname,
    lastName: sellerData.lname,
    country: sellerData.country,
    companyName: sellerData.companyName,
    postalCode: sellerData.zipCode,
    address: sellerData.street,
    location: sellerData.location,
    mobile: sellerData.phone,
    email: sellerData.email,
    password: sellerData.password,
  });

  return result.dataValues.id;
}

exports.storeSellerDetails = storeSellerDetails;

async function storeAd(adData, sellerId) {
  console.log("###########storing in the data base &&&&&&&&&&");

  const ad = await AD.create({
    sellerId: sellerId,
    vehicleClass: adData.vehicleClass,
    category: adData.category,
    make: adData.make,
    constructionYear: adData.constructionYear,
    firstRegistration: adData.firstRegistration,
    generalInspection: adData.generalInspection,
    model: adData.model,
    importantColumnHashKey: sha1(
      adData.make + adData.constructionYear + adData.model + adData.mileage
    ),
    mileage: adData.mileage,
    modelDescription: adData.modelDescription,
    condition: adData.condition,
    power: adData.power,
    gearbox: adData.gearbox,
    fuel: adData.fuel,
    envkvCompliant: adData.envkvCompliant,
    energyEfficiencyClass: adData.energyEfficiencyClass,
    co2: adData.co2,
    consumptionInner: adData.consumptionInner,
    consumptionOuter: adData.consumptionOuter,
    consumptionCombined: adData.consumptionCombined,
    consumptionUnit: adData.consumptionUnit,
    envkvPetrolType: adData.envkvPetrolType,
    emissionSticker: adData.emissionSticker,
    exteriorColor: adData.exteriorColor,
    manufacturerColorName: adData.manufacturerColorName,
    metallic: adData.metallic,
    interiorColor: adData.interiorColor,
    interiorType: adData.interiorType,
    countryVersion: adData.countryVersion,
    damageUnrepaired: adData.damageUnrepaired,
    accidentDamaged: adData.accidentDamaged,
    roadworthy: adData.roadworthy,
    abs: adData.abs,
    centralLocking: adData.centralLocking,
    climatisation: adData.climatisation,
    electricHeatedSeats: adData.electricHeatedSeats,
    electricWindows: adData.electricWindows,
    esp: adData.esp,
    navigationSystem: adData.navigationSystem,
    parkingAssistants: adData.parkingAssistants
      ? adData.parkingAssistants.join()
      : "",
    powerAssistedSteering: adData.powerAssistedSteering,
    description: adData.description,
    deliveryPeriod: adData.deliveryPeriod,
    dealerHomepage: adData.dealerHomepage,
    warranty: adData.warranty,
    consumerPriceGross: adData.price ? adData.price.consumerPriceGross : null,
    vatRate: adData.price ? adData.price.vatRate : null,
    type: adData.price ? adData.price.type : null,
    currency: adData.price ? adData.price.currency : null,
    images: adData.images ? adData.images.join() : null,
  });

  return ad.dataValues.id;
}

exports.storeAd = storeAd;

// ************************** store image ref to ad *************************

async function handleWhenSumGreaterThanLimit(
  data,
  prevImageList,
  imageList,
  callType
) {
  console.log("Prev + new > 15");
  let allImages = imageList;
  // Count of images which can be inserted
  let imagesNeededCount = 15 - prevImageList.length;
  let imagesNeededList = imageList.splice(0, imagesNeededCount);

  // upload the needed images to s3
  let urls = "";
  if (callType == "upload") {
    urls = await s3.uploadMultipleFile(imagesNeededList, "./images-uploads/");
  } else {
    // when the call type is associate(image list will contain s3 urls)
    urls = imagesNeededList;
  }
  let finalImageList = prevImageList.concat(urls);
  data.images = finalImageList.join();
  await data.save();
  // delete the images from nonAssociate tabel after association
  if (callType == "associate") {
    await nonAssociatedImages.destroy({ where: { image: imagesNeededList } });
  }
  return data.images.split(",");
}

async function handleWhenSumLesserThanLimit(
  data,
  prevImageList,
  imageList,
  callType
) {
  // when sum of prev and new images is less than limit
  let urls = "";
  if (callType == "upload") {
    urls = await s3.uploadMultipleFile(imageList, "./images-uploads/");
  } else {
    // when the call type is associate
    urls = imageList;
  }
  let finalImageList = prevImageList.concat(urls);
  data.images = finalImageList.join();
  await data.save();
  // delete the images from nonAssociate tabel after association
  if (callType == "associate") {
    await nonAssociatedImages.destroy({ where: { image: imageList } });
  }
  return data.images.split(",");
}

// params :  adid - ad id to which the image is to be associated,
//           imageList - list of images which are added to the ad,
//           callType - called by associate or by upload
async function addImagesToAd(adId, imageList, res, callType) {
  console.log("storing the image list in data base");

  let data = await AD.findByPk(adId);
  let prevImageList = data.images ? data.images.split(",") : [];
  console.log(prevImageList);

  // MAX number of images per ad are 15
  console.log(prevImageList.length);
  if (prevImageList.length == 15) {
    // delete all the images sent by seller
    console.log("number of images are already 15");
    await utils.deleteImages(imageList);
    res.send("Images Per Ad limit exceeded").status(400);
  } else if (imageList.length + prevImageList.length >= 15) {
    let result = await handleWhenSumGreaterThanLimit(
      data,
      prevImageList,
      imageList,
      callType
    );
    res.status(200).send(result);
  } else {
    let result = await handleWhenSumLesserThanLimit(
      data,
      prevImageList,
      imageList,
      callType
    );
    res.status(200).send(result);
  }
}
exports.addImagesToAd = addImagesToAd;

// *************************   store the images in non associated table  ***************
async function saveNonAssociatedImages(imageName) {
  console.log("Adding ", imageName, "to non associated db");
  await nonAssociatedImages.create({
    image: imageName,
  });
}

exports.saveNonAssociatedImages = saveNonAssociatedImages;

async function deleteImagesFromDB(adId) {
  console.log("Deleting the images from D.B.");
  let data = await AD.findByPk(adId);
  let images = data.images.split(",");
  data.images = "";
  await data.save();
  return images;
}

exports.deleteImagesFromDB = deleteImagesFromDB;

// ************************ Fetch Operations ********************

// params :  id - object to be searched for,
async function fetchSingleAd(id) {
  let data = await AD.findOne({ where: { id: id }, raw: true });
  console.log(data);
  let images = data.images;
  if (images) {
    images = images.split(",");
  }
  data.images = images;
  return data;
}

exports.fetchSingleAd = fetchSingleAd;

// params :  sellerid - object to be searched for, returns all of seller
async function fetchAllAdOfSeller(sellerId) {
  let data = await AD.findAll({ where: { sellerId: sellerId }, raw: true });
  console.log(data);
  for (let ad of data) {
    let images = ad.images;
    if (images) {
      images = images.split(",");
    }
    ad.images = images;
  }
  return data;
}

exports.fetchAllAdOfSeller = fetchAllAdOfSeller;

// params :  id - object to be searched for,
// returns the 5 ads
async function fetchAllAds() {
  let data = await AD.findAll({
    attributes: [
      "id",
      "model",
      "make",
      "mileage",
      "images",
      "fuel",
      "gearbox",
      "firstRegistration",
      "condition",
      "description",
      "power",
    ],
    raw: true,
    limit: 10,
  });
  for (let ad of data) {
    let images = ad.images;
    if (images) {
      images = images.split(",");
    }
    ad.images = images;
  }
  return data;
}

exports.fetchAllAds = fetchAllAds;
