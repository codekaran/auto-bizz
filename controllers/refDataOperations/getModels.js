const Make = require("../../models/make");

const handleModelFetch = async (req, res) => {
  try {
    let make = req.params.make;
    console.log(make);
    let result = await Make.findAll({
      where: { make: make },
      attributes: ["model"],
      raw: true,
    });
    console.log(result);
    res.status(200).json(result);
  } catch (err) {
    console.log(err);
    res.status(500).send("internal error");
  }
};
exports.handleModelFetch = handleModelFetch;
