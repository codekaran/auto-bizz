const Seller = require("../models/sellerDetails");
const utils = require("../helperFunctions/utility");

const auth = (req, res, next) => {
  try {
    let authParts = Buffer.from(
      req.headers.authorization.split(" ")[1],
      "base64"
    ).toString("utf8");
    let user = authParts.split(":")[0];
    console.log("In auth");
    console.log(user);
    if (user === "karan") {
      next();
    } else {
      res.status(401).send("access denied");
    }
  } catch (error) {
    console.log("error in auth");
    res.status(401).send("access denied");
  }
};

exports.auth = auth;

// Checks wether the seller exists or not
const sellerAuth = async (req, res, next) => {
  try {
    console.log("Checking the seller");
    let sellerId = req.params.sellerId;
    let sellerExists = await utils.idExists(sellerId, Seller);
    if (sellerExists) {
      console.log("Seller exists");
      next();
    } else {
      res.send("Seller Id does not exists").status(400);
    }
  } catch (error) {
    console.log(error);
    res.status(500).send("Something went wrong");
    // when the id is invalid mongo throws cast error.
    // if (error.name === "CastError") {
    //   res.send("invalid seller id").status(400);
    // } else {
    //   console.log(error);
    //   res.send("Somethig  went wrong").status(500);
    // }
  }
};

exports.sellerAuth = sellerAuth;
