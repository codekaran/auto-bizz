const Seller = require("../models/sellerDetails");
const utils = require("../helperFunctions/utility");
const jwt = require("jsonwebtoken");

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

// Checks wether the requester is authorised or not
const sellerAuth = async (req, res, next) => {
  const token = req.header("x-auth-token");
  if (!token) {
    return res.status(401).json({ msg: "no token auth denied" });
  }
  try {
    console.log("Checking the seller");

    //unsecure as random id can be inserted
    // let sellerId = req.params.sellerId;

    // //secure due to randomness and also not in URL

    // //no need to check seller as the token is signed
    // let sellerExists = await utils.idExists(sellerId, Seller);

    // //code for old implementation
    // if (sellerExists) {
    //   console.log("Seller exists");
    //   next();
    // } else {
    //   res.send("Seller Id does not exists").status(400);
    // }

    //secure code token
    const decoded = jwt.verify(token, process.env.jwt_secret);
    req.id = decoded.id;
    next();
  } catch (error) {
    console.log(error);
    res.status(401).json({ msg: "invalid token" });
  }
};

exports.sellerAuth = sellerAuth;
