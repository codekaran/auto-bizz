const bcrypt = require("bcrypt");
const Seller = require("../../models/sellerDetails");
const jwt = require("jsonwebtoken");

handleUserLogin = async (req, res) => {
  try {
    console.log("inside login");
    let email = req.body.email;
    let password = req.body.password;
    let data = await Seller.findOne({
      where: { email: email },
      attributes: ["companyName", "firstName", "lastName", "password"],
    });
    if (!data) {
      return res.status(400).send("Seller Does not exists");
    }
    console.log(password, "  ", data.dataValues.password);
    let status = await bcrypt.compare(password, data.dataValues.password);
    if (status) {
      let token = jwt.sign(data.dataValues, "mysecret", { expiresIn: "1h" });
      res.status(200).header({ token: token }).send("user logged in");
    }
  } catch (err) {
    res.status(500).send("Something went wrong");
    console.log(err);
  }
};

exports.handleUserLogin = handleUserLogin;
