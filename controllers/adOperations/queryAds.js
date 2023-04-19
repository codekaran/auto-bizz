const adColumns = require("../constants/adColumns");
const { Op, where } = require("sequelize");
const AD = require("../../models/ad");

// ***********************  returns ads based on search params *************************
// max should be greater, handle null
const queryAds = async (req, res) => {
  try {
    console.log(req.body);
    let searchParams = req.body;
    let searchParamsArr = [];
    console.log(adColumns);
    for (let key in searchParams) {
      // ignoring max as it is handled with min
      if (!key.includes("max")) {
        let searchValue = searchParams[key];
        // storing the min and max for between sql query
        if (key.includes("min")) {
          console.log("inside min");
          let attribute = key.split("_")[1];
          searchValue = {
            [Op.between]: [searchParams[key], searchParams["max_" + attribute]],
          };
          key = attribute;
        }
        searchParamsArr.push({ [key]: searchValue });
      }
    }
    console.log(searchParamsArr);
    let whereClause = { where: { [Op.and]: searchParamsArr } };
    let data = await AD.findAll({ ...whereClause, raw: true });
    console.log(data);
    res.status(200).send({ msg: data });
  } catch (error) {
    console.log(error);
    res.status(500).json({ msg: "Something  went wrong" });
  }
};
exports.queryAds = queryAds;
