// Importaciones necesarias para las rutas de usuario
import express from "express";
import bcrypt from "bcrypt";
import User from "../models/User.js";
import {
  addUser,
  listAllUsers,
  listUserById,
  updateUser,
  deleteUser
} from "../controllers/User.Controller.js";

// Crear router de Express
const router = express.Router();

// ⚠️ Primero las rutas específicas (deben ir antes de las genéricas para evitar conflictos)

// Ruta para registrar un nuevo usuario
router.post("/register", addUser);

// Ruta para iniciar sesión
router.post("/login", async (req, res) => {
  try {
    // Extraer email y password del body de la petición
    const { email, password } = req.body;

    // Validar que email y password estén presentes
    if (!email || !password) {
      return res.status(400).json({ message: "Email y contraseña son obligatorios" });
    }

    // Buscar usuario por email en la base de datos
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Usuario no encontrado" });
    }

    // Verificar que la contraseña sea correcta comparando con el hash almacenado
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(400).json({ message: "Contraseña incorrecta" });
    }

    // Respuesta exitosa con datos del usuario (sin contraseña)
    res.status(200).json({
      message: "Inicio de sesión exitoso",
      user: { nombre: user.nombre, email: user.email },
    });
  } catch (error) {
    // Log del error y respuesta de error del servidor
    console.error("Error en login:", error);
    res.status(500).json({ message: "Error del servidor" });
  }
});

// Luego las rutas genéricas (CRUD completo para usuarios)

// Obtener todos los usuarios
router.get("/", listAllUsers);

// Obtener un usuario por ID
router.get("/:id", listUserById);

// Actualizar un usuario por ID
router.put("/:id", updateUser);

// Eliminar un usuario por ID
router.delete("/:id", deleteUser);

// Exportar el router para usarlo en el servidor principal
export default router;
