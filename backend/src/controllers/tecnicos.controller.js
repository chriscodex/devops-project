import Tecnico from '../models/tecnico.model.js';

export const getTecnicos = async (req, res) => {
  try {
    const tecnicos = await Tecnico.find();
    res.json(tecnicos);
  } catch (error) {
    return res.status(500).json({ message: 'something went wrong' });
  }
};

export const createTecnico = async (req, res) => {
  try {
    const { dni, nombres, apellidos, celular, email, direccion, rol } =
      req.body;

    const newTecnico = new Tecnico({
      dni,
      nombres,
      apellidos,
      celular,
      email,
      direccion,
      rol,
    });

    const savedTecnico = await newTecnico.save();
    res.json(savedTecnico);
  } catch (error) {
    return res.status(500).json({ message: 'something went wrong' });
  }
};


