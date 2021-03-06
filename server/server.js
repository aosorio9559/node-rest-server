require("./config/config");
const express = require("express");
const mongoose = require("mongoose");
const app = express();
const bodyParser = require("body-parser");
const path = require("path");

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
/* Habilitar carpeta public */
app.use(express.static(path.resolve(__dirname, "../public")));
/* Configuración global de rutas */
app.use(require("./routes/index"));

mongoose.connect(
  process.env.URLDB,
  { useCreateIndex: true, useNewUrlParser: true, useUnifiedTopology: true },
  (error, res) => {
    if (error) throw error;
    console.log("BD en línea");
  }
);

app.listen(process.env.PORT, () =>
  console.log("Listening on port", process.env.PORT)
);
