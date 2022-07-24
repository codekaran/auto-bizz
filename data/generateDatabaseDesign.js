const sequelizeConnection = require("../data/sqlConnection");

const Seller = require("../models/sellerDetails");
const AD = require("../models/ad");
const nonAssociatedImages = require("../models/nonAssociatedImages");
const Make = require("../models/make");
const makeModelObject = require("./outputfile.json");
Seller.hasMany(AD);
AD.belongsTo(Seller);

sequelizeConnection
  .sync({ force: true })
  .then((result) => {
    // console.log(result);

    console.log("inside create make");
    console.log(typeof makeModelObject);
    Make.bulkCreate(makeModelObject)
      .then(() => {})
      .catch((err) => {
        console.log(err);
      });
  })
  .catch((err) => {
    console.log(err);
  });

let createMakeTable = async () => {};

createMakeTable();
