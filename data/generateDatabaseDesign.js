const sequelizeConnection = require("../data/sqlConnection");

const Seller = require("../models/sellerDetails");
const AD = require("../models/ad");
const nonAssociatedImages = require("../models/nonAssociatedImages");

Seller.hasMany(AD);
AD.belongsTo(Seller);
sequelizeConnection
  .sync({ force: true })
  .then((result) => {
    console.log(result);
  })
  .catch((err) => {
    console.log(err);
  });
