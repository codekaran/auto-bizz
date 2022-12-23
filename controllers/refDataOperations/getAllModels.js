const { Sequelize } = require("sequelize/dist");
const Make = require("../../models/make");

const handleModelsFetch = async (req, res) => {
  try {
    let data = await Make.findAll({
      attributes: [
        [
          Sequelize.fn(
            "concat",
            Sequelize.col("make"),
            " ",
            Sequelize.col("model")
          ),
          "carname",
        ],
      ],
      raw: true,
    });
    console.log(data);
    res.status(200).json(data);
  } catch (err) {
    res.status(500).send("something went wrong");
    console.log(err);
  }
};
exports.handleModelsFetch = handleModelsFetch;
