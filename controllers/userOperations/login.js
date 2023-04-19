const bcrypt = require("bcrypt");

const {
  generateToken,
  getUserDataUtil,
  updateUserDataUtil,
} = require("./userUtility");

handleUserLogin = async (req, res) => {
  try {
    let email = req.body.email;
    let password = req.body.password;
    let data = await getUserDataUtil({ email: email }, [
      "id",
      "firstName",
      "password",
      "active",
    ]);
    if (!data) {
      return res.status(400).send({ errMsg: "Seller Does not exists" });
    }

    let status = await bcrypt.compare(password, data.password);
    if (status) {
      // active comes as 0(false) 1(true) in sequelize
      // setting user active if deactivated
      if (!data.active) {
        updateUserDataUtil({ id: data.id }, { active: true });
      }
      let token = await generateToken({ id: data.id }, "1h");
      console.log(token);
      res.status(200).send({ token });
    } else {
      console.log("PASSWORD MISMATCH");
      res.status(401).send({ errMsg: "password error" });
    }
  } catch (err) {
    res.status(500).send({ errMsg: "Something went wrong" });
    console.log(err);
  }
};

exports.handleUserLogin = handleUserLogin;
