const Category = require("../models/categoryModel.js");

const createCategory = async (req, res) => {
  const { name } = req.body;
  const category = { name };

  try {
    const id = await Category.addCategory(category);
    res.status(201).send({ id, message: "Category created successfully." });
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
};

const listCategory = async (req, res) => {
  try {
    const categories = await Category.getAllCategories();
    res.status(200).json({
      data: categories,
      status: 200,
      message: "success",
    });
  } catch (error) {
    res.status(500).json({ status: 500, error: error.message });
  }
};

const updateCategory = async (req, res) => {
  const { id } = req.params;
  const { name } = req.body;
  const category = { name };

  try {
    const updated = await Category.updateCategory(id, category);
    if (updated) {
      res.status(201).json({status:201, message: "Category updated successfully." });
    } else {
      res.status(404).json({status:404, error: "Category not found." });
    }
  } catch (error) {
    res.status(500).json({status:500, error: error.message });
  }
};


const deleteCategory = async (req, res) => {
  const { id } = req.params;

  try {
    const deleted = await Category.deleteCategory(id);
    if (deleted) {
      res.status(204).json({status:204,message:"Xóa thành công"}); // Trả về mã trạng thái 204 No Content
    } else {
      res.status(404).json({ status: 404, error: "Category not found." });
    }
  } catch (error) {
    res.status(500).json({ status: 500, error: error.message });
  }
};


module.exports = {
  createCategory,
  listCategory,
  updateCategory,
  deleteCategory
};
