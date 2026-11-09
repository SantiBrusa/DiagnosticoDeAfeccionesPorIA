import { Router } from "express";
import path from "path";
import Afeccion from "../models/afeccion.js";
import { analizarConIA } from "../utils/gemini.js";

const router = Router();

const TIPOS_IMAGEN = {
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".png": "image/png",
  ".webp": "image/webp",
};

router.post("/ia/diagnosticar/:id", async (req, res) => {
  try {
    const afeccion = await Afeccion.findById(req.params.id).lean();
    if (!afeccion) {
      return res.status(404).json({ error: "Afección no encontrada" });
    }

    let rutaImagen;
    let tipoImagen;
    if (afeccion.image) {
      rutaImagen = path.join(process.cwd(), "public", afeccion.image);
      tipoImagen = TIPOS_IMAGEN[path.extname(afeccion.image).toLowerCase()];
    }

    const resultado = await analizarConIA({
      sintomas: afeccion.sintomas.join(", "), 
      descripcion: afeccion.descripcion,
      rutaImagen,
      tipoImagen,
    });

    const diagnostico = {
      afeccion: resultado.afeccion,
      explicacion: resultado.explicacion,
      gravedad: resultado.gravedad,
      recomendaciones: resultado.recomendaciones,
      consultar_medico: resultado.consultar_medico === true,
      fecha: new Date(),
    };

    await Afeccion.findByIdAndUpdate(req.params.id, {diagnostico})

    res.json(diagnostico);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
});

export default router;
