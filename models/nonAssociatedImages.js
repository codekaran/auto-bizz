const sequelizeConnection = require("../data/sqlConnection");
const Sequelize = require("sequelize");

const nonAssociatedImagesSchema = sequelizeConnection.define(
  "non_associated_images",
  {
    image: {
      type: Sequelize.STRING,
      primaryKey: true,
      allowNull: false,
    },
  }
);

module.exports = nonAssociatedImagesSchema;
