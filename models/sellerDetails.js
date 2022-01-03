const mongoose = require("mongoose");
const sequelizeConnection = require("../data/sqlConnection");
const Sequelize = require("sequelize");

const sellerDetailsSchema = sequelizeConnection.define("sellers", {
  id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    primaryKey: true,
    allowNull: false,
  },
  companyName: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  street: {
    type: Sequelize.STRING,
  },
  postalCode: {
    type: Sequelize.STRING,
  },
  address: {
    type: Sequelize.STRING,
  },
  location: {
    type: Sequelize.STRING,
  },
  mobile: {
    type: Sequelize.BIGINT,
  },
  email: {
    type: Sequelize.STRING,
  },
  creationDate: {
    type: Sequelize.DATE,
  },
});

module.exports = sellerDetailsSchema;

// const sellerDetailsSchema = mongoose.Schema({
//   _id: mongoose.Schema.Types.ObjectId,
//   companyName: { type: String, required: true, unique: true },
//   street: String,
//   postalCode: String,
//   address: String,
//   location: String,
//   mobile: { type: Number, required: true, unique: true },
//   email: { type: String, required: true, unique: true },
// });
// module.exports = mongoose.model("SellerDetails", sellerDetailsSchema);
