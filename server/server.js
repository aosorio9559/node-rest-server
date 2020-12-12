require("./config/config");
const express = require("express");
const app = express();
const bodyParser = require("body-parser");

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.get("/usuario", (req, res) => {
  res.json("Heloo");
});

app.post("/usuario", (req, res) => {
  const body = req.body;
  if (body.nombre === undefined) {
    res.status(400).json({
      ok: false,
      mensaje: "Nombre es necesario",
    });
  } else {
    res.json({ persona: body });
  }
});

app.put("/usuario/:id", (req, res) => {
  const id = req.params.id;
  res.json({ id });
});

app.delete("/usuario", (req, res) => {
  res.json("Heloo");
});

app.listen(process.env.PORT, () => console.log("Listening on port", process.env.PORT));
