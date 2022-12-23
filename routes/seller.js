var express = require("express");
var router = express.Router();

const { auth } = require("../controllers/authFunctions");
const { sellerAuth } = require("../controllers/authFunctions");

// helper functions
const {
  handleUserRegisteration,
  handleEmailCheck,
} = require("../controllers/userOperations/registration");

const { handleUserLogin } = require("../controllers/userOperations/login");
const {
  handleUserDataFetch,
} = require("../controllers/userOperations/fetchUserData");
// ********************* User Operations *******************

// user registeration
router.post("/register", auth, async (req, res, next) => {
  console.log(req.body);
  // res.send("hhjelloo");
  handleUserRegisteration(req, res);
});

//login
router.post("/login", auth, async (req, res, next) => {
  handleUserLogin(req, res);
});

// check if the email already exists
router.get("/emailExists", async (req, res, next) => {
  handleEmailCheck(req, res);
});

// returns user data
router.get("/userData/:id", async (req, res, next) => {
  handleUserDataFetch(req, res);
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
