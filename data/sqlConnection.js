// const mysql = require("mysql");
const Sequelize = require("sequelize");

const sequelize = new Sequelize("autobizz", "root", "Autobizz@123", {
  dialect: "mysql",
  host: "localhost",
});

module.exports = sequelize;
