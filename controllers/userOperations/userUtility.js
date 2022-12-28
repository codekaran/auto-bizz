const bcrypt = require("bcrypt");

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
