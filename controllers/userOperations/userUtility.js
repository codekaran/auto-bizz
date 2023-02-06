const bcrypt = require("bcrypt");
const Seller = require("../../models/sellerDetails");
// for jwt token
const jwt = require("jsonwebtoken");
require("dotenv").config();

const encryptPassword = async (plainTextPassword) => {
  return await bcrypt.hash(plainTextPassword, 10);
};

exports.encryptPassword = encryptPassword;

async function generateToken(data, expireTime) {
  let token = await jwt.sign(data, process.env.jwt_secret, {
    expiresIn: expireTime,
  });
  return token;
}

exports.generateToken = generateToken;

// get user data
// id - search based on which id, attr - list of attributes -([*] or ['a','b'])
async function getUserDataUtil(filterObj, attrArr) {
  let data = await Seller.findOne({
    where: filterObj,
    attributes: attrArr,
    raw: true,
  });
  return data;
}

exports.getUserDataUtil = getUserDataUtil;

// update user data
// filterObj - search based on which obj {id:id}, updateObj - obj with new values
async function updateUserDataUtil(filterObj, updateObj) {
  console.log(updateObj);
  let data = await Seller.update(updateObj, { where: filterObj });
  console.log(data);
  return data;
}

exports.updateUserDataUtil = updateUserDataUtil;
