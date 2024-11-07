// controllers/categoriesCourseController.js

const CategoriesCourse = require('../models/categories_courseModel');

// Lấy tất cả danh mục khóa học
exports.getAllCategoriesCourse = async (req, res) => {
  try {
    const categoriesCourse = await CategoriesCourse.findAll();
    res.json({ status: 'success', data: categoriesCourse });
  } catch (error) {
    console.error('Error fetching categories_course:', error);
    res.status(500).json({ error: 'An error occurred while fetching categories_course' });
  }
};

// Tạo danh mục khóa học mới
exports.createCategoriesCourse = async (req, res) => {
  const { name } = req.body;

  try {
    const newCategoriesCourse = await CategoriesCourse.create({ name });
    res.status(201).json({ status: 'success', data: newCategoriesCourse });
  } catch (error) {
    console.error('Error creating categories_course:', error);
    res.status(500).json({ error: 'An error occurred while creating categories_course' });
  }
};

// Cập nhật danh mục khóa học
exports.updateCategoriesCourse = async (req, res) => {
  const { id } = req.params;
  const { name } = req.body;

  try {
    const categoriesCourse = await CategoriesCourse.findByPk(id);
    if (!categoriesCourse) {
      return res.status(404).json({ error: 'Categories_course not found' });
    }

    categoriesCourse.name = name || categoriesCourse.name;
    await categoriesCourse.save();

    res.json({ status: 'success', data: categoriesCourse });
  } catch (error) {
    console.error('Error updating categories_course:', error);
    res.status(500).json({ error: 'An error occurred while updating categories_course' });
  }
};

// Xóa danh mục khóa học
exports.deleteCategoriesCourse = async (req, res) => {
  const { id } = req.params;

  try {
    const categoriesCourse = await CategoriesCourse.findByPk(id);
    if (!categoriesCourse) {
      return res.status(404).json({ error: 'Categories_course not found' });
    }

    await categoriesCourse.destroy();
    res.json({ status: 'success', message: 'Categories_course deleted successfully' });
  } catch (error) {
    console.error('Error deleting categories_course:', error);
    res.status(500).json({ error: 'An error occurred while deleting categories_course' });
  }
};
