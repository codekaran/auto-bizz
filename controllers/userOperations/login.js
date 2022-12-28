const bcrypt = require("bcrypt");
const Seller = require("../../models/sellerDetails");
const { generateToken } = require("./userUtility");

handleUserLogin = async (req, res) => {
  try {
    let email = req.body.email;
    let password = req.body.password;
    let data = await Seller.findOne({
      where: { email: email },
      attributes: ["id", "firstName", "password"],
      raw: true,
    });

    if (!data) {
      return res.status(400).send({ error: "Seller Does not exists" });
    }

    let status = await bcrypt.compare(password, data.password);
    if (status) {
      let token = await generateToken({ id: data.id }, "1h");
      console.log(token);
      res.status(200).send({ token });
    } else {
      console.log("PASSWORD MISMATCH");
      res.status(401).send({ error: "password error" });
    }
  } catch (err) {
    res.status(500).send("Something went wrong");
    console.log(err);
  }
};

exports.handleUserLogin = handleUserLogin;
