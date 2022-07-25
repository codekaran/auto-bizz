const mongoose = require("mongoose");
const Seller = require("../models/sellerDetails");

async function duplicateCheck(sellerData) {
  console.log("Checking if the seller is duplicate");
  let status = await Seller.findOne({
    where: { email: sellerData.email },
  });
  console.log(status);
  if (status == null) {
    return true;
  }
  return false;
}
exports.duplicateCheck = duplicateCheck;
