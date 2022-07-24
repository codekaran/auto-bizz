const sequelizeConnection = require("../data/sqlConnection");
const Sequelize = require("sequelize");

const makeSchema = sequelizeConnection.define("makes", {
  id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    primaryKey: true,
    allowNull: false,
  },
  make: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  model: {
    type: Sequelize.STRING,
    allowNull: false,
  },
});

module.exports = makeSchema;
