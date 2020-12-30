const express = require("express");
const app = express();
const Usuario = require("../models/usuario");
const {
  verificaToken,
  verificaAdminRole,
} = require("../middlewares/autenticacion");
const bcrypt = require("bcrypt");

app.get("/usuario", verificaToken, (req, res) => {
  /** `req.query.desde` Parámetro opcional que se puede pasar por URL: `localhost:3000/usuario?desde=10` */
  const desde = Number(req.query.desde) || 0;
  const limite = Number(req.query.limite) || 5;
  Usuario.find({ estado: true }, "nombre email role estado google img")
    .skip(desde)
    .limit(limite)
    .exec((err, usuarios) => {
      if (err) {
        return res.status(400).json({
          ok: false,
          err,
        });
      }

      Usuario.countDocuments({ estado: true }, (err, conteo) => {
        res.json({
          ok: true,
          usuarios,
          cuantos: conteo,
        });
      });
    });
});

app.post("/usuario", [verificaToken, verificaAdminRole], (req, res) => {
  const body = req.body;
  const usuario = new Usuario({
    nombre: body.nombre,
    email: body.email,
    password: bcrypt.hashSync(body.password, 10),
    role: body.role,
  });

  usuario.save((err, usuarioBD) => {
    if (err) {
      return res.status(400).json({
        ok: false,
        err,
      });
    }
    // usuarioBD.password = null;

    res.json({
      ok: true,
      usuario: usuarioBD,
    });
  });
});

app.put("/usuario/:id", [verificaToken, verificaAdminRole], (req, res) => {
  const id = req.params.id;
  const body = req.body;
  const options = {
    /** Retorna los datos actualizados del documento en lugar de los datos antes de del update */
    new: true,
  };

  Usuario.findByIdAndUpdate(id, body, options, (err, usuarioBD) => {
    if (err) {
      return res.status(400).json({
        ok: false,
        err,
      });
    }
    res.json({
      ok: true,
      usuario: usuarioBD,
    });
  });
});

app.delete("/usuario/:id", [verificaToken, verificaAdminRole], (req, res) => {
  const id = req.params.id;
  // Usuario.findByIdAndRemove(id, (err, usuarioBorrado) => {
  const cambiaEstado = { estado: false };
  Usuario.findByIdAndUpdate(
    id,
    cambiaEstado,
    { new: true },
    (err, usuarioBorrado) => {
      if (err) {
        return res.status(400).json({
          ok: false,
          err,
        });
      }

      if (!usuarioBorrado) {
        return res.status(400).json({
          ok: false,
          err: {
            message: "Usuario no encontrado",
          },
        });
      }
      res.json({
        ok: true,
        usuario: usuarioBorrado,
      });
    }
  );
});

module.exports = app;
