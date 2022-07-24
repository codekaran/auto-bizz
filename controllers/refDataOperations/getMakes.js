const Make = require("../../models/make");

const handleMakeFetch = async (req, res) => {
  try {
    let data = await Make.findAll({
      attributes: ["make"],
      group: "make",
      raw: true,
    });
    console.log(data);
    res.status(200).json(data);
  } catch (err) {
    res.status(500).send("something went wrong");
    console.log(err);
  }
};
exports.handleMakeFetch = handleMakeFetch;
