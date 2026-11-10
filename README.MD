# Diagnóstico de Afecciones por IA

Trabajo final de la materia **Bases de Datos 2** — Instituto Santo Domingo (ISSD), 2026.

Aplicación web para cargar afecciones dermatológicas (síntomas, descripción e imagen) y obtener un diagnóstico orientativo generado por inteligencia artificial. Los diagnósticos se guardan en la base de datos y pueden consultarse o volver a generarse cuando se quiera.

> ⚠️ El diagnóstico es orientativo y no reemplaza la consulta con un profesional de la salud.

## Características

- Login de usuario con manejo de sesión mediante cookies.
- CRUD completo de afecciones (crear, listar, editar y eliminar).
- Carga de imagen asociada a cada afección.
- Diagnóstico por IA (Gemini) a partir de síntomas, descripción e imagen.
- El diagnóstico incluye: posible afección, explicación, gravedad, recomendaciones, si conviene consultar a un médico y fecha.
- Persistencia del diagnóstico en MongoDB: la tabla indica qué afecciones ya fueron diagnosticadas y permite ver el resultado o volver a diagnosticar.
- Base de datos en la nube (MongoDB Atlas).

## Tecnologías

- **Backend:** Node.js, Express
- **Base de datos:** MongoDB Atlas con Mongoose
- **Vistas:** Handlebars
- **IA:** API de Google Gemini
- **Frontend:** HTML, CSS y JavaScript

## Estructura del proyecto

```
├── public/
│   ├── images/                  # Imágenes estáticas
│   ├── styles/                  # Hojas de estilo
│   └── uploads/                 # Imágenes cargadas por los usuarios
└── src/
    ├── config/
    │   └── db.js                # Conexión a MongoDB Atlas
    ├── controllers/
    │   └── afeccion.controller.js
    ├── models/
    │   └── afeccion.js          # Esquema de Mongoose
    ├── routes/
    │   ├── afeccion.routes.js   # CRUD de afecciones
    │   ├── auth.routes.js       # Login
    │   ├── ia.routes.js         # Diagnóstico por IA
    │   └── views.routes.js      # Rutas de las vistas
    ├── utils/
    │   ├── gemini.js            # Integración con la API de Gemini
    │   ├── revisarLogin.js      # Middleware de autenticación
    │   └── upload.js            # Configuración de carga de imágenes
    ├── views/
    │   ├── afecciones/
    │   │   ├── diagnostico.handlebars
    │   │   ├── editar.handlebars
    │   │   ├── lista.handlebars
    │   │   └── nueva.handlebars
    │   ├── layouts/
    │   │   └── main.handlebars
    │   ├── home.handlebars
    │   └── login.handlebars
    └── app.js                   # Punto de entrada
```

## Modelo de datos

**Afección**

| Campo         | Tipo       | Descripción                                    |
| ------------- | ---------- | ---------------------------------------------- |
| `nombre`      | String     | Nombre de la afección (requerido)              |
| `sintomas`    | [String]   | Lista de síntomas (requerido)                  |
| `descripcion` | String     | Descripción (requerido)                        |
| `image`       | String     | Imagen asociada                                |
| `diagnostico` | Objeto     | Resultado de la IA: afección, explicación, gravedad, recomendaciones, consultar_medico y fecha |

## Instalación

1. Clonar el repositorio:

   ```bash
   git clone https://github.com/SantiBrusa/DiagnosticoDeAfeccionesPorIA.git
   cd DiagnosticoDeAfeccionesPorIA
   ```

2. Instalar las dependencias:

   ```bash
   npm install
   ```

3. Crear un archivo `.env` en la raíz con tus credenciales (los nombres pueden variar según tu configuración):

   ```env
    PORT=8080
    MONGO_URI=tu_cadena_de_conexion_de_mongodb_atlas
    GEMINI_API_KEY=tu_api_key_de_gemini
    GEMINI_MODEL=gemini-2.5-flash
    COOKIE_SECRET=una_clave_secreta_para_las_cookies
   ```

4. Iniciar la aplicación:

   ```bash
   npm start
   ```

5. Abrir en el navegador: `http://localhost:8080`

## Uso

1. Iniciar sesión (usuario: `alumno`, clave: `alu123`).
2. Cargar una afección con sus síntomas, descripción e imagen.
3. En la tabla, presionar **Diagnosticar por IA**.
4. Consultar el resultado con **Ver diagnóstico**; se puede regenerar con **Volver a diagnosticar**.
5. Editar o eliminar afecciones desde la misma tabla.

## Autores

- Franco Santillan
- Ezequiel Perez
- Santino Vissani

Materia: Bases de Datos 2 — ISSD, 2026.