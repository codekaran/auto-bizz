// const mysql = require("mysql");
const Sequelize = require("sequelize");

const sequelize = new Sequelize("autobizz", "root", "admin", {
  dialect: "mysql",
  host: "localhost",
  logging: false,
});

module.exports = sequelize;
