// Importaciones necesarias para el controlador de usuarios
import User from "../models/User.js";
import bcrypt from "bcrypt";

// Función para crear un nuevo usuario (registro)
export const addUser = async (req, res) => {
  try {
    // Extraer datos del body de la petición
    const { nombre, email, password } = req.body;

    // Validar que todos los campos obligatorios estén presentes
    if (!nombre || !email || !password) {
      return res.status(400).json({ message: "Todos los campos son obligatorios" });
    }

    // Verificar si el usuario ya existe por email (evitar duplicados)
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "El usuario ya existe" });
    }

    // Hashear la contraseña antes de guardarla
    const hashedPassword = await bcrypt.hash(password, 10);

    // Crear nuevo usuario con la contraseña hasheada
    const newUser = new User({ nombre, email, password: hashedPassword });

    // Guardar el usuario en la base de datos
    await newUser.save();

    // Respuesta exitosa con datos del usuario creado (sin contraseña)
    res.status(201).json({
      message: "Usuario creado con éxito",
      user: { nombre: newUser.nombre, email: newUser.email },
    });
  } catch (error) {
    // Log del error y respuesta de error del servidor
    console.error("❌ Error al crear usuario:", error);
    res.status(500).json({ message: "Error del servidor" });
  }
};

// Función para listar todos los usuarios
export const listAllUsers = async (req, res) => {
  try {
    // Obtener todos los usuarios excluyendo la contraseña por seguridad
    const users = await User.find().select("-password");
    res.status(200).json(users);
  } catch (error) {
    // Log del error y respuesta de error del servidor
    console.error("❌ Error al listar usuarios:", error);
    res.status(500).json({ message: "Error del servidor" });
  }
};

// Función para listar un usuario por ID
export const listUserById = async (req, res) => {
  try {
    // Buscar usuario por ID excluyendo la contraseña
    const user = await User.findById(req.params.id).select("-password");
    if (!user) return res.status(404).json({ message: "Usuario no encontrado" });
    res.status(200).json(user);
  } catch (error) {
    // Log del error y respuesta de error del servidor
    console.error("❌ Error al buscar usuario:", error);
    res.status(500).json({ message: "Error del servidor" });
  }
};

// Función para actualizar un usuario
export const updateUser = async (req, res) => {
  try {
    // Obtener ID del usuario de los parámetros de la ruta
    const { id } = req.params;

    // Actualizar usuario y devolver el documento actualizado (sin contraseña)
    const updatedUser = await User.findByIdAndUpdate(id, req.body, {
      new: true,
    }).select("-password");

    // Verificar si el usuario existe
    if (!updatedUser)
      return res.status(404).json({ message: "Usuario no encontrado" });

    // Respuesta exitosa
    res.status(200).json({ message: "Usuario actualizado", user: updatedUser });
  } catch (error) {
    // Log del error y respuesta de error del servidor
    console.error("❌ Error al actualizar usuario:", error);
    res.status(500).json({ message: "Error del servidor" });
  }
};

// Función para eliminar un usuario
export const deleteUser = async (req, res) => {
  try {
    // Obtener ID del usuario de los parámetros de la ruta
    const { id } = req.params;

    // Eliminar usuario por ID
    const deleted = await User.findByIdAndDelete(id);

    // Verificar si el usuario existía
    if (!deleted)
      return res.status(404).json({ message: "Usuario no encontrado" });

    // Respuesta exitosa
    res.status(200).json({ message: "Usuario eliminado con éxito" });
  } catch (error) {
    // Log del error y respuesta de error del servidor
    console.error("❌ Error al eliminar usuario:", error);
    res.status(500).json({ message: "Error del servidor" });
  }
};
