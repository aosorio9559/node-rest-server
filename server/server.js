require("./config/config");
const express = require("express");
const mongoose = require("mongoose");
const app = express();
const bodyParser = require("body-parser");

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(require("./routes/usuario"))


mongoose.connect("mongodb://localhost:27017/cafe", (error, res) => {
  if (error) throw error
  console.log("BD en línea");
});


app.listen(process.env.PORT, () =>
  console.log("Listening on port", process.env.PORT)
);
