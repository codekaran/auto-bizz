const bcrypt = require("bcrypt");
const Seller = require("../../models/sellerDetails");
const jwt = require("jsonwebtoken");
require("dotenv").config();

handleUserLogin = async (req, res) => {
  try {
    console.log("inside login");
    let email = req.body.email;
    let password = req.body.password;
    let data = await Seller.findOne({
      where: { email: email },
      attributes: ["id", "firstName", "password"],
      raw: true,
    });

    if (!data) {
      return res.status(400).send("Seller Does not exists");
    }

    // checking if the password matches
    console.log(process.env.jwt_secret);

    let status = await bcrypt.compare(password, data.password);
    if (status) {
      console.log("USER VERIFIED CREATING TOKEN");
      console.log(data);
      let token = await jwt.sign(
        {
          firstName: data.firstName,
          id: data.id,
        },
        process.env.jwt_secret,
        { expiresIn: "1h" }
      );
      console.log(token);
      res.status(200).send({ auth: true, token: token });
    } else {
      console.log("PASSWORD MISMATCH");
      res.status(401).send({ auth: false });
    }
  } catch (err) {
    res.status(500).send("Something went wrong");
    console.log(err);
  }
};

exports.handleUserLogin = handleUserLogin;
