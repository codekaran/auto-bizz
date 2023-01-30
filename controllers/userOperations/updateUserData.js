const Seller = require("../../models/sellerDetails");
const { getUserDataUtil, updateUserDataUtil } = require("./userUtility");
const bcrypt = require("bcrypt");

handleUserUpdate = async (req, res) => {
  try {
    let sellerId = req.sellerId;
    console.log("updating user data for ", sellerId);
    let newUserData = req.body;
    // if user wants to update email
    if (
      newUserData.hasOwnProperty("email") ||
      newUserData.hasOwnProperty("newPassword")
    ) {
      // it can be done only when current password is present
      if (newUserData.hasOwnProperty("currentPassword")) {
        let data = await getUserDataUtil({ id: sellerId }, ["password"]);
        let status = await bcrypt.compare(
          newUserData.currentPassword,
          data.password
        );
        if (status) {
          if (newUserData.hasOwnProperty("newPassword")) {
            let hash = await bcrypt.hash(newUserData.newPassword, 10);
            delete newUserData.newPassword;
            delete newUserData.currentPassword;
            newUserData["password"] = hash;
          }
          console.log(newUserData);
        }
        // wrong password
        else {
          return res.status(400).send({ errMsg: "Invalid Credentials" });
        }
      } else {
        // password field not present
        return res.status(400).send({ errMsg: "Unauthorized request" });
      }
    }
    // update the user with new values
    let update = await updateUserDataUtil({ id: sellerId }, newUserData);
    if (update[0] > 0) {
      res.status(200).send({ msg: "Successfully Updated" });
    }
  } catch (err) {
    console.log("Error occured while updating user data");
    console.log(err);
    res.status(500).send({ errMsg: "Internal error" });
  }
};

exports.handleUserUpdate = handleUserUpdate;
