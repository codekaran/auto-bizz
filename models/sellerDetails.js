const sequelizeConnection = require("../data/sqlConnection");
const Sequelize = require("sequelize");

const sellerDetailsSchema = sequelizeConnection.define("sellers", {
  id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    primaryKey: true,
    allowNull: false,
  },
  sellerType: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  firstName: {
    type: Sequelize.STRING,
  },
  lastName: {
    type: Sequelize.STRING,
  },
  country: {
    type: Sequelize.STRING,
    allowNull: false,
  },

  companyName: {
    type: Sequelize.STRING,
  },
  postalCode: {
    type: Sequelize.STRING,
  },
  city: {
    type: Sequelize.STRING,
  },
  address: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  location: {
    type: Sequelize.STRING,
  },
  mobile: {
    type: Sequelize.BIGINT,
    allowNull: false,
  },
  email: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  password: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  active: {
    type: Sequelize.BOOLEAN,
    allowNull: false,
  },
  creationDate: {
    type: Sequelize.DATE,
  },
});

module.exports = sellerDetailsSchema;
