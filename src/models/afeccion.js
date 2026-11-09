import mongoose from "mongoose";

const diagnosticoSchema = new mongoose.Schema(
  {
    afeccion: String,
    explicacion: String,
    gravedad: String,
    recomendaciones: String,
    consultar_medico: Boolean,
    fecha: { type: Date, default: Date.now },
  },
  { _id: false },
);

const afeccionSchema = new mongoose.Schema({
  nombre: {
    type: String,
    required: true,
  },
  sintomas: {
    type: [String],
    required: true,
  },
  descripcion: {
    type: String,
    required: true,
  },
  image: {
    type: String,
  },
  diagnostico: diagnosticoSchema, // queda undefined hasta que se diagnostica
});

export default mongoose.model("Afeccion", afeccionSchema);
