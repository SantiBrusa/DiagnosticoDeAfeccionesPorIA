import { Router } from "express";
import { upload } from "../utils/upload.js";
import {
  mostrarFormulario,
  crearAfeccion,
  listarAfecciones,
  verDiagnostico,
  mostrarEdicion,
  eliminarAfeccion,
  actualizarAfeccion
} from "../controllers/afeccion.controller.js";

const router = Router();

router.get("/", listarAfecciones);
router.get("/nueva", mostrarFormulario);
router.post("/", upload.single("image"), crearAfeccion);

router.get("/:id/editar", mostrarEdicion);
router.post("/:id/editar", upload.single("image"), actualizarAfeccion);
router.post("/:id/eliminar", eliminarAfeccion);
router.get("/:id/diagnostico", verDiagnostico);

export default router;
