const Seller = require("../models/sellerDetails");
// returns true if record exists in database
async function duplicateCheck(sellerData) {
  console.log("Checking if the seller is duplicate");
  let status = await Seller.findOne({
    where: { email: sellerData.email },
  });
  console.log(status);
  if (status == null) {
    return false;
  }
  return true;
}
exports.duplicateCheck = duplicateCheck;
