import Afeccion from "../models/afeccion.js";
import fs from "fs";
import path from "path";

const borrarImagen = async (rutaPublica) => {
  if (!rutaPublica) return;
  try {
    await fs.promises.unlink(path.join(process.cwd(), "public", rutaPublica)); // definir bien 
  } catch {
    // si el archivo ya no existe, no pasa nada
  }
};

export const mostrarFormulario = (req, res) => {
  res.render("afecciones/nueva");
};

export const crearAfeccion = async (req, res) => {
  try {
    const { nombre, sintomas, descripcion } = req.body;

    const listaSintomas = sintomas
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);

    if (!nombre || !descripcion || !listaSintomas.length === 0) {
      return res.status(400).render("afecciones/nueva", {
        error: "Completa nombre, sintomas y descripcion.",
        valores: { nombre, sintomas, descripcion },
      });
    }

    await Afeccion.create({
      nombre: nombre.trim(),
      sintomas: listaSintomas,
      descripcion: descripcion.trim(),
      image: req.file ? `/uploads/${req.file.filename}` : undefined,
    });

    res.redirect("/afecciones");
  } catch (error) {
    console.error(error);
    res.status(500).render("afecciones/nueva", {
      error: "Error al guardar la afección.",
      valores: req.body,
    });
  }
};

export const listarAfecciones = async (req, res) => {
  try {
    const afecciones = await Afeccion.find().lean();
    res.render("afecciones/lista", { afecciones });
  } catch (error) {
    console.error(error);
    res.status(500).send("Error al obtener las afecciones");
  }
};

export const mostrarEdicion = async (req, res) => {
  try {
    const afeccion = await Afeccion.findById(req.params.id).lean();
    if (!afeccion) return res.status(404).send("Afección no encontrada");

    res.render("afecciones/editar", {
      afeccion,
      sintomasTexto: afeccion.sintomas.join(", "),
    });
  } catch (error) {
    console.error(error);
    res.status(400).send("ID inválido");
  }
};

export const actualizarAfeccion = async (req, res) => {
  try {
    const afeccion = await Afeccion.findById(req.params.id);
    if (!afeccion) return res.status(404).send("Afección no encontrada");

    const { nombre, sintomas, descripcion } = req.body;
    const listaSintomas = sintomas
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);

    // Si cambian los datos que usa la IA, el diagnóstico guardado queda viejo
    const cambioClinico =
      afeccion.descripcion !== descripcion.trim() ||
      afeccion.sintomas.join("|") !== listaSintomas.join("|") ||
      Boolean(req.file);

    afeccion.nombre = nombre.trim();
    afeccion.sintomas = listaSintomas;
    afeccion.descripcion = descripcion.trim();

    if (req.file) {
      await borrarImagen(afeccion.image); 
      afeccion.image = `/uploads/${req.file.filename}`;
    }

    if (cambioClinico) afeccion.diagnostico = undefined;

    await afeccion.save();
    res.redirect("/afecciones");
  } catch (error) {
    console.error(error);
    res.status(500).send("Error al actualizar la afección");
  }
};

export const eliminarAfeccion = async (req, res) => {
  try {
    const afeccion = await Afeccion.findByIdAndDelete(req.params.id);
    if (afeccion) await borrarImagen(afeccion.image);
    res.redirect("/afecciones");
  } catch (error) {
    console.error(error);
    res.status(500).send("Error al eliminar la afeccion")
  }
}

export const verDiagnostico = async (req, res) => {
  try {
    const afeccion = await Afeccion.findById(req.params.id).lean();
    if (!afeccion) return res.status(404).send("Afección no encontrada");
    res.render("afecciones/diagnostico", { afeccion });
  } catch (error) {
    console.error(error);
    res.status(400).send("ID inválido");
  }
};
