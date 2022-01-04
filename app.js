const express = require("express");
const app = express();
const indexRouter = require("./routes/index");
// require("./data/connection");
require("./data/sqlConnection");

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

app.set("encoding", null);

// app.use(auth);

app.use("/seller-api/sellers", indexRouter);

// 18004259449

app.get("/getCarList", async function (req, res) {
  getObjectList(res);
});

app.listen(process.env.PORT || 8000);

console.log("listeneing to port 8000");
