import { Router } from "express";

const router = Router();

router.get("/login", (req, res) => {
  res.render("login");
});

router.post("/login", (req, res) => {
  const { usuario, clave } = req.body;

  if (usuario === "alumno" && clave === "alu123") {
    res.cookie("usuario", usuario, { signed: true });
    res.redirect("/");
  } else {
    res.render("login", { error: "Usuario o clave incorrecta" });
  }
});

router.get("/logout", (req, res) => {
  res.clearCookie("usuario");
  res.redirect("/login");
});

export default router;
