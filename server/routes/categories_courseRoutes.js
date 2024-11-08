// routes/categories_courseRoutes.js
const express = require("express");
const router = express.Router();
const CategoriesCourse = require("../models/categories_courseModel");

router.get("/", async (req, res) => {
  try {
    const categories = await CategoriesCourse.findAll();
    res.json({ status: "success", data: categories });
  } catch (error) {
    res.status(500).json({ error: "An error occurred while fetching categories" });
  }
});

router.post("/", async (req, res) => {
  const { name } = req.body;
  try {
    const category = await CategoriesCourse.create({ name });
    res.status(201).json({ status: "success", data: category });
  } catch (error) {
    res.status(500).json({ error: "An error occurred while creating category" });
  }
});

router.put("/:id", async (req, res) => {
  const { id } = req.params;
  const { name } = req.body;
  try {
    const category = await CategoriesCourse.findByPk(id);
    if (!category) return res.status(404).json({ error: "Category not found" });

    category.name = name;
    await category.save();
    res.json({ status: "success", data: category });
  } catch (error) {
    res.status(500).json({ error: "An error occurred while updating category" });
  }
});

router.delete("/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const category = await CategoriesCourse.findByPk(id);
    if (!category) return res.status(404).json({ error: "Category not found" });

    await category.destroy();
    res.json({ status: "success", message: "Category deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: "An error occurred while deleting category" });
  }
});

module.exports = router;
