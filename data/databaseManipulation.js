const mongoose = require("mongoose");
const AD = require("../models/ad");
const SellerDetails = require("../models/sellerDetails");
const sha1 = require("sha1");
const utils = require("../helperFunctions/utility");

// ************************ Save Operations ********************

async function storeAd(adData, sellerId) {
  const ad = new AD({
    _id: new mongoose.Types.ObjectId(),
    seller: sellerId,
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
    parkingAssistants: adData.parkingAssistants,
    powerAssistedSteering: adData.powerAssistedSteering,
    description: adData.description,
    deliveryPeriod: adData.deliveryPeriod,
    dealerHomepage: adData.dealerHomepage,
    warranty: adData.warranty,

    price: {
      consumerPriceGross: adData.price.consumerPriceGross,
      vatRate: adData.price.vatRate,
      type: adData.price.type,
      currency: adData.price.currency,
    },
    images: adData.images,
  });
  let savedAd = await ad.save();
  return savedAd._id;
}

exports.storeAd = storeAd;

async function storeSellerDetails(sellerData) {
  console.log(sellerData);
  const seller = new SellerDetails({
    _id: new mongoose.Types.ObjectId(),
    companyName: sellerData.companyName,
    street: sellerData.street,
    postalCode: sellerData.postalCode,
    address: sellerData.address,
    location: sellerData.location,
    mobile: sellerData.mobile,
    email: sellerData.email,
  });
  let status = await seller.save();
  return status._id;
}

exports.storeSellerDetails = storeSellerDetails;

// store image ref to ad
async function addImagesToAd(adId, imageNames, res) {
  console.log("storing the image list in data base");
  let imageList = imageNames;
  let newImageFlag = 0;
  let data = await AD.findById(adId);
  let prevImageList = data.images;
  // MAX number of images per ad are 15
  if (imageList.length + prevImageList.length > 15) {
    console.log("number of images more than 15");
    // delete the images which are not needed
    await utils.deleteImages(imageNames);
    res.send("Images Per Ad limit exceeded").status(400);
  } else {
    // check if the image ref already exists
    for (let image of imageList) {
      if (!prevImageList.includes(image)) {
        prevImageList.push(image);
        newImageFlag = 1;
      }
    }
    // if  atleast one image ref is new
    if (newImageFlag === 1) {
      data.images = prevImageList;
      let result = await data.save();
      res.send(result.images).status(200);
      // move images to sellerId/adId folder
      // if (operationType === "associate") {
      //   await utils.moveImages(sellerId, adId, imageList);
      // }
    } else {
      console.log("All Images already exists");
      res.send(data.images).status(200);
    }
  }
}
exports.addImagesToAd = addImagesToAd;
// ************************ Fetch Operations ********************

// params :  id - object to be searched for,
//           feild - field name having id as value,
//           model - collection to be searched for
async function fetchDataById(id, field, model) {
  let query = {};
  query[field] = id;
  let collection = "";
  if (model === "AD") {
    collection = AD;
  }
  let data = await collection.find(query);
  return data;
}

exports.fetchDataById = fetchDataById;

// ************************ Delete Operations ********************

// params :  id - object to be searched for,
//           feild - field name having id as value,
//           model - collection to be searched for
async function deleteDataById(id, field, model) {
  let query = {};
  query[field] = id;

  let data = await model.deleteOne(query);
  return data;
}

exports.deleteDataById = deleteDataById;

async function deleteImagesFromDB(adId) {
  let data = await AD.findById(adId);
  let images = data.images;
  console.log(data);
  data.images = [];
  await data.save();
  console.log("deleted the images from DB");
  return images;
}

exports.deleteImagesFromDB = deleteImagesFromDB;
