import "dotenv/config";
import express from "express";
import cookieParser from "cookie-parser";
import { engine } from "express-handlebars";
import conectarDB from "./config/db.js";
import authRoutes from "./routes/auth.routes.js";
import { revisarLogin } from "./utils/revisarLogin.js";
import viewsRouter from "./routes/views.routes.js";
import iaRoutes from "./routes/ia.routes.js";
import afeccionRoutes from "./routes/afeccion.routes.js";

const app = express();

app.use(express.json());
app.use(express.static("./public"));
app.use(express.urlencoded({ extended: true }));

conectarDB();

app.engine("handlebars", engine());
app.engine('handlebars', engine({
  helpers: {
    formatFecha: (fecha) =>
      new Date(fecha).toLocaleString('es-AR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        hour12: false
      })
  }
}));
app.set("view engine", "handlebars");
app.set("views", "./src/views");

app.use(cookieParser(process.env.COOKIE_SECRET));

app.use((req, res, next) => {
  res.locals.usuario = req.signedCookies.usuario;
  next();
});

app.use(authRoutes);
app.use(revisarLogin);
app.use("/afecciones", afeccionRoutes);
app.use(iaRoutes);
app.use(viewsRouter);

app.use((err, req, res, next) => {
  console.error(err);
  if (req.originalUrl.startsWith("/afecciones")) {
    return res.status(400).render("afecciones/nueva", {
      error: err.message,
    });
  }
  res.status(500).send("Error interno");
});

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => console.log(`Server iniciado en puerto ${PORT}`));
