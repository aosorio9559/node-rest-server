const express = require("express");
const fileUpload = require("express-fileupload");
const fs = require("fs");
const path = require("path");
const app = express();
const Usuario = require("../models/usuario");
const Producto = require("../models/producto");

app.use(fileUpload({ useTempFiles: true }));

app.put("/upload/:tipo/:id", (req, res) => {
  const tipo = req.params.tipo;
  const id = req.params.id;

  if (!req.files) {
    return res.status(400).json({
      ok: false,
      err: {
        message: "No se ha seleccionado ningún archivo",
      },
    });
  }

  /* Validar tipo */
  const tiposValidos = ["productos", "usuarios"];

  if (tiposValidos.indexOf(tipo) < 0) {
    return res.status(400).json({
      ok: false,
      err: {
        message: `Los tipos válidos son: ${tiposValidos.join(", ")}`,
      },
    });
  }

  const archivo = req.files.archivo;
  const extension = archivo.name.split(".").pop().toLowerCase();
  /** Extensiones permitidas */
  const extensionesValidas = ["png", "jpg", "gif", "jpeg"];
  if (extensionesValidas.indexOf(extension) < 0) {
    return res.status(400).json({
      ok: false,
      err: {
        message: `Las extensiones válidas son: ${extensionesValidas.join(
          ", "
        )}`,
        extensionRecibida: extension,
      },
    });
  }

  /* Cambiar el nombre del archivo */
  const nombreArchivo = `${id}-${new Date().getTime()}.${extension}`;

  archivo.mv(`uploads/${tipo}/${nombreArchivo}`, (err) => {
    if (err) {
      return res.status(500).json({
        ok: false,
        err,
      });
    }
    /* En este momento, la imagen ya se encuentra alojada en el servidor */

    if (tipo === "usuarios") {
      guardarImagenUsuario(id, res, nombreArchivo);
    } else if (tipo === "productos") {
      guardarImagenProducto(id, res, nombreArchivo);
    }
  });
});

function guardarImagenProducto(id, res, nombreArchivo) {
  Producto.findById(id, (err, productoBD) => {
    if (err) {
      /* Si hay un error en el servidor, se debe borrar la imagen subida */
      borrarImagen(nombreArchivo, "productos");
      return res.status(500).json({
        ok: false,
        err,
      });
    }

    if (!productoBD) {
      /* Si el usuario no es encontrado, se debe borrar la imagen subida */
      borrarImagen(nombreArchivo, "productos");
      return res.status(400).json({
        ok: false,
        err: {
          message: "Producto no existe",
        },
      });
    }

    /* Se borra la imagen subida antes de proceder a subir una imagen nueva */
    borrarImagen(productoBD.img, "productos");

    productoBD.img = nombreArchivo;
    productoBD.save((err, productoGuardado) => {
      if (err) {
        return res.status(500).json({
          ok: false,
          err,
        });
      }

      res.json({
        ok: true,
        producto: productoGuardado,
        img: nombreArchivo,
      });
    });
  });
}

function guardarImagenUsuario(id, res, nombreArchivo) {
  Usuario.findById(id, (err, usuarioBD) => {
    if (err) {
      /* Si hay un error en el servidor, se debe borrar la imagen subida */
      borrarImagen(nombreArchivo, "usuarios");
      return res.status(500).json({
        ok: false,
        err,
      });
    }

    if (!usuarioBD) {
      /* Si el usuario no es encontrado, se debe borrar la imagen subida */
      borrarImagen(nombreArchivo, "usuarios");
      return res.status(400).json({
        ok: false,
        err: {
          message: "Usuario no existe",
        },
      });
    }

    /* Se borra la imagen subida antes de proceder a subir una imagen nueva */
    borrarImagen(usuarioBD.img, "usuarios");

    usuarioBD.img = nombreArchivo;
    usuarioBD.save((err, usuarioGuardado) => {
      if (err) {
        return res.status(500).json({
          ok: false,
          err,
        });
      }

      res.json({
        ok: true,
        usuario: usuarioGuardado,
        img: nombreArchivo,
      });
    });
  });
}

function borrarImagen(nombreImagen, tipo) {
  const pathImagen = path.resolve(
    __dirname,
    `../../uploads/${tipo}/${nombreImagen}`
  );
  if (fs.existsSync(pathImagen)) {
    fs.unlinkSync(pathImagen);
  }
}

module.exports = app;
