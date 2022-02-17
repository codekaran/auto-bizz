const express = require("express");
const app = express();
const sellerRouter = require("./routes/seller");
const adRouter = require("./routes/ads");
const imageRouter = require("./routes/images");
const multer = require("multer");
const variables = require("./helperFunctions/variables");
const { sellerAuth } = require("./controllers/authFunctions");

// require("./data/connection");
require("./data/sqlConnection");
// generating the database schema if not generated
require("./data/generateDatabaseDesign");

var bodyParser = require("body-parser");
app.use(bodyParser.raw({ type: "image/jpeg", limit: 2097152 }));

app.use(function (req, res, next) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE");
  res.setHeader("Access-Control-Allow-Headers", "*");
  res.setHeader("Access-Control-Allow-Credentials", true);
  next();
});

app.use(bodyParser.json());

app.use(bodyParser.urlencoded({ extended: true }));
// multer stores zip file in zip-uploads and images in image-uploads
app.use(multer({ storage: variables.storage }).array("file"));
// sellerAuth,
app.set("encoding", null);

// app.use(auth);

app.use("/seller-api/sellers", sellerRouter);
app.use("/seller-api/ads", adRouter);
app.use("/seller-api/images", imageRouter);

// 18004259449

app.get("/getCarList", async function (req, res) {
  getObjectList(res);
});

app.listen(process.env.PORT || 8000);

console.log("listeneing to port 8000");
