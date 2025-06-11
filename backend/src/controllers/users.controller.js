import User from '../models/user.model.js';
import bcryptjs from 'bcryptjs';

export const update = async (req, res) => {
  try {
    const { email, password, username, id } = req.body;
    const passwordHash = await bcryptjs.hash(password, 10);

    const newUser = await User.findByIdAndUpdate(
      id,
      {
        username,
        email,
        password: passwordHash,
      },
      {
        new: true,
      }
    );
    if (!newUser) return res.status(404).json({ message: 'User not found' });

    res.json(newUser);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getUsers = async (req, res) => {
  try {
    const userSystem = await User.findById(req.user.payload.id);
    if (!userSystem)
      return res.status(404).json({ message: 'acceso denegado' });
    const users = await User.find({ rol: 'tecnico' });
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const deleteUser = async (req, res) => {
  try {
    const userSystem = await User.findById(req.user.payload.id);
    if (!userSystem)
      return res.status(404).json({ message: 'acceso denegado' });
    if (userSystem.rol !== 'administrador')
      return res.status(404).json({ message: 'acceso denegado' });
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateUser = async (req, res) => {
  try {
    const userSystem = await User.findById(req.user.payload.id);
    if (!userSystem)
      return res.status(404).json({ message: 'acceso denegado' });
    const {
      username,
      apellidos,
      nombres,
      celular,
      email,
      direccion,
      password,
    } = req.body;

    const { userId: id } = req.params;

    if (password) {
      const passwordHashed = await bcryptjs.hash(password, 10);
      const user = await User.findByIdAndUpdate(
        id,
        {
          username,
          apellidos,
          nombres,
          celular,
          email,
          direccion,
          password: passwordHashed,
        },
        {
          new: true,
        }
      );
      if (!user) return res.status(404).json({ message: 'User not found' });
      res.json(user);
    } else {
      const user = await User.findByIdAndUpdate(
        id,
        {
          username,
          apellidos,
          nombres,
          celular,
          email,
          direccion,
        },
        {
          new: true,
        }
      );
      if (!user) return res.status(404).json({ message: 'User not found' });
      res.json(user);
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message });
  }
};
