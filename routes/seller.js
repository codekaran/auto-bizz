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
const {
  handleUserUpdate,
} = require("../controllers/userOperations/updateUserData");
const {
  handleUserDeactivate,
} = require("../controllers/userOperations/deactivateUser");
// ********************* User Operations *******************

// user registeration -change karan
router.post("/register", auth, async (req, res, next) => {
  handleUserRegisteration(req, res);
});

//login - change karan
router.post("/login", auth, async (req, res, next) => {
  handleUserLogin(req, res);
});

// check if the email already exists
router.get("/emailExists", async (req, res, next) => {
  handleEmailCheck(req, res);
});

// returns user data
router.get("/userData", sellerAuth, async (req, res, next) => {
  handleUserDataFetch(req, res);
});

router.put("/updateUser", sellerAuth, async (req, res, next) => {
  handleUserUpdate(req, res);
});

router.post("/deativateUser", sellerAuth, (req, res) => {
  handleUserDeactivate(req, res);
});

module.exports = router;
