// Importaciones necesarias para la conexión a la base de datos
import mongoose from "mongoose";
import dotenv from "dotenv";

// Configurar variables de entorno
dotenv.config();

// Función para conectar a la base de datos MongoDB
export const connectDB = async () => {
  try {
    // Obtener la URI de MongoDB de las variables de entorno o usar valor por defecto
    const mongoUri = process.env.MONGO_URI || "mongodb+srv://daniellujan123489_db_user:Station192005@cluster0.n8s8m2l.mongodb.net/";

    // Intentar conectar a MongoDB
    await mongoose.connect(mongoUri);

    // Mensaje de éxito en la conexión
    console.log("✅ Conectado a MongoDB correctamente");
  } catch (error) {
    // Log del error y salida del proceso si falla la conexión
    console.error("❌ Error al conectar a MongoDB:", error.message);
    process.exit(1);
  }
};
