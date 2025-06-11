import User from '../models/user.model.js';
import bcryptjs from 'bcryptjs';
import { createAccessToken } from '../libs/jwt.js';
import jwt from 'jsonwebtoken';
import { TOKEN_SECRET } from '../config.js';

export const register = async (req, res) => {
  try {
    const {
      username,
      apellidos,
      nombres,
      celular,
      email,
      direccion,
      rol,
      password,
    } = req.body;
    const userFound = await User.findOne({ username });
    if (userFound) {
      return res.status(400).json(['DNI ya existe']);
    }

    const passwordHash = await bcryptjs.hash(password, 10);

    const newUser = new User({
      username,
      apellidos,
      nombres,
      celular,
      email,
      direccion,
      rol,
      password: passwordHash,
    });

    const userSaved = await newUser.save();

    res.json({
      id: userSaved._id,
      username: userSaved.username,
      apellidos: userSaved.apellidos,
      nombres: userSaved.nombres,
      celular: userSaved.celular,
      email: userSaved.email,
      direccion: userSaved.direccion,
      rol: userSaved.rol,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message });
  }
};

export const login = async (req, res) => {
  const { username, password } = req.body;

  try {
    const userFound = await User.findOne({ username });

    if (!userFound) {
      return res.status(400).send(['El usuario no existe']);
    }

    const isPasswordMatch = await bcryptjs.compare(
      password,
      userFound.password
    );

    if (!isPasswordMatch) {
      return res.status(400).send(['Contraseña incorrecta']);
    }

    const token = await createAccessToken({ id: userFound._id });

    res.cookie('token', token);

    res.json({
      id: userFound._id,
      username: userFound.username,
      apellidos: userFound.apellidos,
      nombres: userFound.nombres,
      celular: userFound.celular,
      email: userFound.email,
      direccion: userFound.direccion,
      rol: userFound.rol,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const logout = (req, res) => {
  res.cookie('token', '', { expires: new Date(0) });
  return res.sendStatus(200);
};

export const profile = async (req, res) => {
  const userFound = await User.findById(req.user.payload.id);

  if (!userFound) return res.status(404).json({ message: 'User not found' });

  const response = res.json({
    id: userFound._id,
    username: userFound.username,
    email: userFound.email,
    createdAt: userFound.createdAt,
    updatedAt: userFound.updatedAt,
  });

  return response;
};

export const verifyToken = async (req, res) => {
  const { token } = req.cookies;

  if (!token) return res.status(401).json({ message: 'Token missing' });

  jwt.verify(token, TOKEN_SECRET, async (err, user) => {
    if (err) return res.status(401).json({ message: 'No autorizado' });

    const userFound = await User.findById(user.payload.id);
    if (!userFound)
      return res.status(404).json({ message: 'Usuario no encontrado' });

    return res.json({
      id: userFound._id,
      username: userFound.username,
      apellidos: userFound.apellidos,
      nombres: userFound.nombres,
      celular: userFound.celular,
      email: userFound.email,
      direccion: userFound.direccion,
      rol: userFound.rol,
    });
  });
};
