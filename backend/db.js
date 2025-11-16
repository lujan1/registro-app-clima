// Importaciones necesarias para la conexión a la base de datos
import mongoose from "mongoose";
import dotenv from "dotenv";

// Configurar variables de entorno
dotenv.config();

// Función para conectar a la base de datos MongoDB
export const connectDB = async () => {
  try {
    // Obtener la URI de MongoDB de las variables de entorno
    const mongoUri = process.env.MONGO_URI;

    if (!mongoUri) {
      console.error("❌ MONGO_URI no está definida en las variables de entorno");
      process.exit(1);
    }

    // Intentar conectar a MongoDB sin opciones deprecated
    await mongoose.connect(mongoUri);

    // Mensaje de éxito en la conexión
    console.log("✅ Conectado a MongoDB correctamente");
  } catch (error) {
    // Log del error y salida del proceso si falla la conexión
    console.error("❌ Error al conectar a MongoDB:", error.message);
    process.exit(1);
  }
};
