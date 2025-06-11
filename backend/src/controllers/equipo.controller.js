import Marca from '../models/marca.model.js';
import categoriaEquipo from '../models/categoriaEquipo.model.js';
import Orden from '../models/orden.model.js';

export const getMarcas = async (req, res) => {
  try {
    const marcas = await Marca.find();
    res.json(marcas);
  } catch (error) {
    return res.status(500).json({ message: 'something went wrong' });
  }
};

export const createMarca = async (req, res) => {
  try {
    const { nombre } = req.body;
    const newMarca = new Marca({ nombre });
    const savedMarca = await newMarca.save();
    res.json(savedMarca);
  } catch (error) {
    return res.status(500).json({ message: 'something went wrong' });
  }
};

export const updateMarca = async (req, res) => {
  try {
    const { id } = req.params;
    const { nombre } = req.body;
    const updatedMarca = await Marca.findByIdAndUpdate(
      id,
      { nombre },
      { new: true }
    );
    res.json(updatedMarca);
  } catch (error) {
    return res.status(500).json({ message: 'something went wrong' });
  }
};

export const deleteMarca = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedMarca = await Marca.findByIdAndDelete(id);
    res.json(deletedMarca);
  } catch (error) {
    return res.status(500).json({ message: 'something went wrong' });
  }
};

export const getCategoriasEquipo = async (req, res) => {
  try {
    const categorias = await categoriaEquipo.find();
    res.json(categorias);
  } catch (error) {
    return res.status(500).json({ message: 'something went wrong' });
  }
};

export const updateCategoriaEquipo = async (req, res) => {
  try {
    const { id } = req.params;
    const { nombre } = req.body;
    const updatedEquipo = await categoriaEquipo.findByIdAndUpdate(
      id,
      { nombre },
      { new: true }
    );
    res.json(updatedEquipo);
  } catch (error) {
    return res.status(500).json({ message: 'something went wrong' });
  }
};

export const createCategoriaEquipo = async (req, res) => {
  try {
    const { nombre } = req.body;
    const newCategoriaEquipo = new categoriaEquipo({ nombre });
    const savedCategoriaEquipo = await newCategoriaEquipo.save();
    res.json(savedCategoriaEquipo);
  } catch (error) {
    return res.status(500).json({ message: 'something went wrong' });
  }
};

export const deleteCategoriaEquipo = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedCategoriaEquipo = await categoriaEquipo.findByIdAndDelete(id);
    res.json(deletedCategoriaEquipo);
  } catch (error) {
    return res.status(500).json({ message: 'something went wrong' });
  }
};
