const { updateUserDataUtil, getUserDataUtil } = require("./userUtility");

handleUserDeactivate = async (req, res) => {
  try {
    let sellerId = req.sellerId;
    console.log("inside deativate user data acc ", sellerId);
    let data = await getUserDataUtil({ id: sellerId }, ["active"]);
    if (data.active) {
      await updateUserDataUtil({ id: sellerId }, { active: false });
      console.log("user deactivated");
      return res.status(200).send({ msg: "User deactivated" });
    } else {
      console.log("user already deactivated");
      res.status(200).send({ msg: "user already deactivated" });
    }
  } catch (err) {
    console.log("Error occured while fetching user data");
    res.status(500).send("Internal error");
  }
};

exports.handleUserDeactivate = handleUserDeactivate;
