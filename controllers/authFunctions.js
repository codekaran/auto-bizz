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
    return res.status(401).json({ errMsg: "no token auth denied" });
  }
  try {
    console.log("Checking the seller");
    const decoded = jwt.verify(token, process.env.jwt_secret);
    req.sellerId = decoded.id;
    next();
  } catch (error) {
    console.log(error);
    res.status(401).json({ errMsg: "invalid token" });
  }
};

exports.sellerAuth = sellerAuth;
