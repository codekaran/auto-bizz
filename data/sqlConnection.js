// const mysql = require("mysql");
const Sequelize = require("sequelize");

const sequelize = new Sequelize("autobizz", "admin", "admin", {
  dialect: "mysql",
  host: "localhost",
});

module.exports = sequelize;

// var connection = mysql.createConnection({
//   host: "localhost",
//   user: "root",
//   password: "admin",
//   database: "autobizz",
// });

// exports.connection = connection;

// connection.connect((err) => {
//   if (err) {
//     console.log("error connecting sql data base:", err);
//     return;
//   }
//   console.log("connected : ", connection.threadId);
// });
