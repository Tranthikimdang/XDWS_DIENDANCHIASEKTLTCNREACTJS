const Authority = require("../models/authorityModel");

const create = async (req, res) => {
  const { name, assigned, created_date, number_of_members} = req.body; // Thêm các trường mới
  const authority = { name, assigned, created_date, number_of_members }; // Bao gồm các trường mới

  try {
    const id = await Authority.add(authority);
    res.status(201).send({ id, message: "Created successfully." });
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
};

const list = async (req, res) => {
  try {
    const authoritys = await Authority.getAll();
    res.status(200).json({
      data: authoritys,
      status: 200,
      message: "success",
    });
  } catch (error) {
    res.status(500).json({ status: 500, error: error.message });
  }
};

const update = async (req, res) => {
  const { id } = req.params;
  const { name, assigned, created_date, number_of_members} = req.body; // Thêm các trường mới
  const authority = { name, assigned, created_date, number_of_members }; // Bao gồm các trường mới

  try {
    const updated = await Authority.update(id, authority);
    if (updated) {
      res.status(201).json({ status: 201, message: "Updated successfully." });
    } else {
      res.status(404).json({ status: 404, error: "Not found." });
    }
  } catch (error) {
    res.status(500).json({ status: 500, error: error.message });
  }
};

const dele = async (req, res) => {
  const { id } = req.params;

  try {
    const deleted = await Authority.dele(id);
    if (deleted) {
      res.status(204).json({ status: 204, message: "Deleted successfully." });
    } else {
      res.status(404).json({ status: 404, error: "Not found." });
    }
  } catch (error) {
    res.status(500).json({ status: 500, error: error.message });
  }
};

module.exports = {
  create,
  list,
  update,
  dele
};
