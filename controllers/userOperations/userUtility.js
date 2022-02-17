const bcrypt = require("bcrypt");

const encryptPassword = async (plainTextPassword) => {
  return await bcrypt.hash(plainTextPassword, 10);
};

exports.encryptPassword = encryptPassword;
