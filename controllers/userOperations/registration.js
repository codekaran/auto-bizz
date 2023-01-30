const validateSeller = require("../../helperFunctions/validateSeller");
const db = require("../../data/databaseHandle");
const bcrypt = require("bcrypt");
const { generateToken } = require("./userUtility");

const handleUserRegisteration = async (req, res) => {
  try {
    // check if seller already exists(*need to check)
    let sellerExists = await validateSeller.duplicateCheck(req.body);

    if (!sellerExists) {
      let hash = await bcrypt.hash(req.body.password, 10);
      req.body.password = hash;
      let id = await db.storeSellerDetails(req);
      // token is sent once the user is registered
      let token = await generateToken({ id: id }, "1h");
      res.status(200).send({ token });
    } else {
      console.log("seller already exists");
      res.status(403).send({ errMsg: "Seller already exists" });
    }
  } catch (error) {
    console.log(error);
    res.status(500).send(error);
  }
};
exports.handleUserRegisteration = handleUserRegisteration;

handleEmailCheck = async (req, res) => {
  try {
    console.log("inside email chekc");
    console.log(req.query);
    let isSellerUnique = await validateSeller.duplicateCheck(req.query);
    console.log(isSellerUnique);
    res.status(200).send(isSellerUnique);
  } catch (error) {
    console.log(error);
    res.status(500).send("Something went wrong");
  }
};

exports.handleEmailCheck = handleEmailCheck;
