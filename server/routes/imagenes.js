const express = require("express");
const fs = require("fs");
const app = express();
const path = require("path");
const { verificaTokenImg } = require("../middlewares/autenticacion");

app.get("/imagen/:tipo/:img", verificaTokenImg, (req, res) => {
  const tipo = req.params.tipo;
  const img = req.params.img;
  const pathImagen = path.resolve(__dirname, `../../uploads/${tipo}/${img}`);

  if (fs.existsSync(pathImagen)) {
    res.sendFile(pathImagen);
  } else {
    const noImagePath = path.resolve(__dirname, "../assets/no-image.PNG");
    res.sendFile(noImagePath);
  }
});

module.exports = app;
