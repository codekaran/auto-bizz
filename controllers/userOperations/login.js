const bcrypt = require("bcrypt");
const Seller = require("../../models/sellerDetails");

handleUserLogin = async (req, res) => {
  try {
    console.log("inside login");
    let email = req.body.email;
    let password = req.body.password;
    let data = await Seller.findOne({ where: { email: email } });
    if (!data) {
      return res.status(400).send("Seller Does not exists");
    }
    console.log(password, "  ", data.dataValues.password);
    let status = await bcrypt.compare(password, data.dataValues.password);
    if (status) {
      res.status(200).send("Usr Logged in");
    }
  } catch (err) {
    res.status(500).send(err);
    console.log(err);
  }
};

exports.handleUserLogin = handleUserLogin;
