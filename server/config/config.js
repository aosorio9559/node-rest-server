/* Puerto */
process.env.PORT = process.env.PORT || 3000;

/* Entorno */
process.env.NODE_ENV = process.env.NODE_ENV || "dev";

/* Expiración del token */
process.env.CADUCIDAD_TOKEN = 60 * 60 * 24 * 30;

/* Semilla de autenticación */
process.env.SEED = process.env.SEED || "este-es-el-seed-de-desarrollo";

/* Base de datos */
let urlDb;
if (process.env.NODE_ENV === "dev") {
  urlDb = "mongodb://localhost:27017/cafe";
} else {
  urlDb = process.env.MONGO_URI;
}

process.env.URLDB = urlDb;

/* Google Client ID */
process.env.CLIENT_ID =
  process.env.CLIENT_ID ||
  "228777236974-rs9hqmldt1gilsllh8qncvuaih70k41f.apps.googleusercontent.com";
