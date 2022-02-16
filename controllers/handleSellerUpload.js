// const mongoDB = require("../data/databaseManipulation");
const validateSeller = require("../helperFunctions/validateSeller");
const db = require("../data/databaseHandle");

const handleUserRegisteration = async (req, res) => {
  try {
    // check if seller already exists(*need to check)
    let isSellerUnique = await validateSeller.duplicateCheck(req.body);
    console.log(isSellerUnique);
    if (isSellerUnique) {
      let id = await db.storeSellerDetails(req);
      console.log(id);
      res.status(200).send({ id: id });
    } else {
      console.log("seller already exists");
      res.status(200).send({ message: "Seller already exists" });
    }
  } catch (error) {
    console.log(error);
    res.status(500).send(error);
  }
};
exports.handleUserRegisteration = handleUserRegisteration;
