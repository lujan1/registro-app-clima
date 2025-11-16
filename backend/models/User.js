// Importar Mongoose para definir el esquema de la base de datos
import mongoose from "mongoose";

// Definir el esquema del usuario
const userSchema = new mongoose.Schema({
  // Campo para el nombre del usuario (obligatorio)
  nombre: { type: String, required: true },

  // Campo para el email del usuario (obligatorio y único para evitar duplicados)
  email: { type: String, required: true, unique: true },

  // Campo para la contraseña hasheada del usuario (obligatorio)
  password: { type: String, required: true },
});

// Crear y exportar el modelo de Usuario basado en el esquema
export default mongoose.model("User", userSchema);
