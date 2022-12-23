var express = require("express");
var router = express.Router();

const {
  handleMakeFetch,
} = require("../controllers/refDataOperations/getMakes");
const {
  handleModelFetch,
} = require("../controllers/refDataOperations/getModels");
const {
  handleModelsFetch,
} = require("../controllers/refDataOperations/getAllModels");
// ********************* Reference Data *******************

//
router.get("/getMakes", async (req, res, next) => {
  handleMakeFetch(req, res);
});

//
router.get("/getModels/:make", async (req, res, next) => {
  handleModelFetch(req, res);
});

router.get("/getModels", async (req, res, next) => {
  handleModelsFetch(req, res);
});

module.exports = router;
