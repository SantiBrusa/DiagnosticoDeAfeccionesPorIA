import fs from "fs";

export async function analizarConIA({
  sintomas,
  descripcion,
  rutaImagen,
  tipoImagen,
}) {
  // Lo que le pedimos a la IA
  const pedido = `Sos un asistente dermatológico. Analizá esta afección de piel.
Síntomas: ${sintomas}
Descripción: ${descripcion}

Respondé SOLO con este formato:
{
  "afeccion": "nombre de la posible afección",
  "explicacion": "explicación breve y simple",
  "gravedad": "leve, moderada o grave",
  "recomendaciones": "qué puede hacer la persona",
  "consultar_medico": true o false
}`;

  const partes = [{ text: pedido }];

  // Si hay foto, se la mandamos también
  if (rutaImagen) {
    const imagen = fs.readFileSync(rutaImagen).toString("base64");
    partes.push({ inline_data: { mime_type: tipoImagen, data: imagen } });
  }

  const respuesta = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/${process.env.GEMINI_MODEL}:generateContent`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-goog-api-key": process.env.GEMINI_API_KEY,
      },
      body: JSON.stringify({
        contents: [{ parts: partes }],
        generationConfig: { responseMimeType: "application/json" },
      }),
    },
  );

  const datos = await respuesta.json();

  if (!respuesta.ok) {
    throw new Error(datos.error?.message || "Error al consultar la IA");
  }

  // La IA devuelve texto; lo convertimos en un objeto que podemos usar
  const texto = datos.candidates[0].content.parts[0].text;
  return JSON.parse(texto);
}
