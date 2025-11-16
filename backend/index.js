// Importaciones necesarias para el servidor
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import { connectDB } from "./db.js";
import userRoutes from "./routes/UserRoutes.js";
import weatherRoutes from "./routes/weather.js";
import forecastRoutes from "./routes/forecast.js";

// Configurar variables de entorno
dotenv.config();

// Crear instancia de Express
const app = express();

// Conectar a la base de datos MongoDB
connectDB();

// Definir puerto del servidor
const PORT = process.env.PORT || 5000;

// Obtener directorio actual para rutas estáticas
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Middlewares
app.use(cors()); // Habilitar CORS para peticiones desde frontend
app.use(express.json()); // Parsear JSON en el body de las peticiones
app.use(express.urlencoded({ extended: true })); // Parsear datos de formularios

// Rutas de la API
// 🔥 Esta línea debe existir y estar antes del frontend para que las rutas de API funcionen
app.use("/api/users", userRoutes); // Rutas para usuarios (registro, login, etc.)
app.use("/clima", weatherRoutes); // Rutas para clima actual
app.use("/pronostico", forecastRoutes); // Rutas para pronóstico

// Ruta raíz de la API
app.get("/api", (req, res) => {
  res.json({ message: "🌦️ API del Clima funcionando correctamente" });
});

// Servir archivos estáticos del frontend construido
app.use(express.static(path.join(__dirname, "../frontend/build")));

// Ruta catch-all para SPA (Single Page Application)
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "../frontend/build", "index.html"));
});

// Iniciar servidor
app.listen(PORT, () => console.log(`✅ Servidor corriendo en puerto ${PORT}`));
