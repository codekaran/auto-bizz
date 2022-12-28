const Seller = require("../../models/sellerDetails");

handleUserDataFetch = async (req, res) => {
  try {
    let sellerId = req.sellerId;
    console.log("inside get user data for ", sellerId);
    let data = await Seller.findOne({
      where: { id: sellerId },
      raw: true,
    });
    res.status(200).send(data);
  } catch (err) {
    console.log("Error occured while fetching user data");
    res.status(500).send("Internal error");
  }
};

exports.handleUserDataFetch = handleUserDataFetch;
