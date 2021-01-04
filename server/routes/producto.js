const express = require("express");
const { verificaToken } = require("../middlewares/autenticacion");
const producto = require("../models/producto");
const app = express();

const Producto = require("../models/producto");

/* Obtener todos los productos */
app.get("/productos", verificaToken, (req, res) => {
  const desde = Number(req.query.desde) || 0;
  const limite = Number(req.query.limite) || 5;

  Producto.find({ disponible: true })
    .skip(desde)
    .limit(limite)
    .populate("usuario", "nombre email")
    .populate("categoria", "descripcion")
    .exec((err, productoBD) => {
      if (err) {
        return res.status(500).json({
          ok: false,
          err,
        });
      }

      res.json({
        ok: true,
        productos: productoBD,
      });
    });
});

app.get("/productos/:id", verificaToken, (req, res) => {
  const id = req.params.id;

  Producto.findById(id)
    .populate("usuario", "nombre email")
    .populate("categoria", "descripcion")
    .exec((err, productoBD) => {
      if (err) {
        return res.status(500).json({
          ok: false,
          err,
        });
      }

      if (!productoBD) {
        return res.status(400).json({
          ok: false,
          err: {
            message: "No existe el ID del producto",
          },
        });
      }

      res.json({
        ok: true,
        producto: productoBD,
      });
    });
});

app.get("/productos/buscar/:termino", verificaToken, (req, res) => {
  const termino = req.params.termino.trim();
  const regExp = new RegExp(termino, "i");
  Producto.find({ nombre: regExp })
    .populate("categoria", "descripcion")
    .exec((err, productoBD) => {
      if (err) {
        return res.status(500).json({
          ok: false,
          err,
        });
      }

      res.json({
        ok: true,
        productos: productoBD,
      });
    });
});

app.post("/productos", verificaToken, (req, res) => {
  const body = req.body;
  const producto = new Producto({
    nombre: body.nombre,
    precioUni: body.precioUni,
    descripcion: body.descripcion,
    usuario: req.usuario._id,
    categoria: body.categoria,
  });

  producto.save((err, productoBD) => {
    if (err) {
      return res.status(500).json({
        ok: false,
        err,
      });
    }

    res.status(201).json({
      ok: true,
      producto: productoBD,
    });
  });
});

app.put("/productos/:id", verificaToken, (req, res) => {
  const id = req.params.id;
  const body = req.body;
  const descProducto = {
    nombre: body.nombre,
    precioUni: body.precioUni,
    descripcion: body.descripcion,
  };

  Producto.findByIdAndUpdate(
    id,
    descProducto,
    { new: true, runValidators: true },
    (err, productoBD) => {
      if (err) {
        return res.status(500).json({
          ok: false,
          err,
        });
      }

      if (!productoBD) {
        return res.status(400).json({
          ok: false,
          err: {
            message: "El ID del producto no existe",
          },
        });
      }

      res.json({
        ok: true,
        producto: productoBD,
      });
    }
  );
});

app.delete("/productos/:id", verificaToken, (req, res) => {
  const id = req.params.id;
  const descProducto = {
    disponible: false,
  };

  Producto.findByIdAndUpdate(
    id,
    descProducto,
    { new: true, runValidators: true },
    (err, productoBD) => {
      if (err) {
        return res.status(500).json({
          ok: false,
          err,
        });
      }

      if (!productoBD) {
        return res.status(400).json({
          ok: false,
          err: {
            message: "El ID del producto no existe",
          },
        });
      }

      res.json({
        ok: true,
        producto: productoBD,
      });
    }
  );
});

module.exports = app;
