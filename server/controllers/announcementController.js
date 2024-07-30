const Announcement = require("../models/announcementModel");

const create = async (req, res) => {
  const { sender, receiver, status, created_date, content } = req.body;
  if (!sender || !receiver || !status || !created_date || !content) {
    return res.status(400).send({ error: "All fields are required." });
  }
  const announcement = { sender, receiver, status, created_date, content };

  try {
    const id = await Announcement.add(announcement);
    res.status(201).send({ id, message: "Created successfully." });
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
};

const list = async (req, res) => {
  try {
    const announcements = await Announcement.getAll();
    res.status(200).json({
      data: announcements,
      status: 200,
      message: "success",
    });
  } catch (error) {
    res.status(500).json({ status: 500, error: error.message });
  }
};

const update = async (req, res) => {
  const { id } = req.params;
  const { sender, receiver, status, created_date, content } = req.body;
  console.log(req.body);
  if (!sender || !receiver || !status || !created_date || !content) {
    return res.status(400).send({ error: "All fields are required." });
  }
  const announcement = { sender, receiver, status, created_date, content };

  try {
    const message = await Announcement.update(id, announcement);
    res.status(201).json({ status: 201, message });
  } catch (error) {
    res.status(500).json({ status: 500, error: error.message });
  }
};

const dele = async (req, res) => {
  const { id } = req.params;

  try {
    const deleted = await Announcement.dele(id);
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
