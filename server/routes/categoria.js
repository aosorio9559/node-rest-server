const express = require("express");
const app = express();
const Categoria = require("../models/categoria");
const {
  verificaToken,
  verificaAdminRole,
} = require("../middlewares/autenticacion");

app.get("/categoria", verificaToken, (req, res) => {
  Categoria.find({})
    .sort("descripcion")
    .populate("usuario", "nombre email")
    .exec((err, categorias) => {
    if (err) {
      return res.status(500).json({
        ok: false,
        err,
      });
    }

    Categoria.countDocuments({}, (err, conteo) => {
      res.json({
        ok: true,
        categorias,
        cuantos: conteo,
      });
    });
  });
});

app.get("/categoria/:id", verificaToken, (req, res) => {
  const id = req.params.id;
  Categoria.findById(id).exec((err, categoriaBD) => {
    if (err) {
      return res.status(500).json({
        ok: false,
        err,
      });
    }

    if (!categoriaBD) {
      return res.status(400).json({
        ok: false,
        err: {
          message: "Categoría no encontrada",
        },
      });
    }

    res.json({
      ok: true,
      categoriaBD,
    });
  });
});

app.post("/categoria", [verificaToken, verificaAdminRole], (req, res) => {
  const body = req.body;
  const categoria = new Categoria({
    descripcion: body.descripcion,
    usuario: req.usuario._id,
  });

  categoria.save((err, categoriaBD) => {
    if (err) {
      return res.status(500).json({
        ok: false,
        err,
      });
    }

    res.json({
      ok: true,
      categoria: categoriaBD,
    });
  });
});

app.put("/categoria/:id", [verificaToken, verificaAdminRole], (req, res) => {
  const id = req.params.id;
  const body = req.body;
  const descCategoria = {
    descripcion: body.descripcion,
  };
  const options = {
    /** Retorna los datos actualizados del documento en lugar de los datos antes de del update */
    new: true,
    runValidators: true,
  };

  Categoria.findByIdAndUpdate(
    id,
    descCategoria,
    options,
    (err, categoriaBD) => {
      if (err) {
        return res.status(500).json({
          ok: false,
          err,
        });
      }

      res.json({
        ok: true,
        categoria: categoriaBD,
      });
    }
  );
});

app.delete("/categoria/:id", [verificaToken, verificaAdminRole], (req, res) => {
  const id = req.params.id;
  Categoria.findByIdAndRemove(
    id,
    { new: true, useFindAndModify: false },
    (err, categoriaBorrada) => {
      if (err) {
        return res.status(500).json({
          ok: false,
          err,
        });
      }

      if (!categoriaBorrada) {
        return res.status(400).json({
          ok: false,
          err: {
            message: "Categoría no encontrada",
          },
        });
      }
      res.json({
        ok: true,
        categoria: categoriaBorrada,
      });
    }
  );
});

module.exports = app;
