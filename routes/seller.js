var express = require("express");
var router = express.Router();

const { auth } = require("../controllers/authFunctions");
const { sellerAuth } = require("../controllers/authFunctions");

// generating the database schema if not generated
require("../data/generateDatabaseDesign");

// helper functions
const {
  handleUserRegisteration,
} = require("../controllers/handleSellerUpload");

// ********************* User Operations *******************

// user registeration
router.post("/register", auth, async (req, res, next) => {
  handleUserRegisteration(req, res);
});

router.post("/seller-api/sellers/:id/ads", auth, (req, res) => {
  console.log(req.params.id);
  console.log("test");
  res.send("helo");
});

router.post("/test", (req, res) => {
  console.log(req.body);
  res.send("ok");
});

module.exports = router;
