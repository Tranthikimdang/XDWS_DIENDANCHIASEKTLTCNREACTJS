const StudyTime = require("../models/studyModel");

// Lấy tất cả bản ghi Study_time
exports.getAllStudyTimes = async (req, res) => {
  try {
    const studyTimes = await StudyTime.findAll();
    res.status(200).json({
      status: "success",
      results: studyTimes.length,
      data: {
        studyTimes,
      },
    });
  } catch (err) {
    res.status(500).send({
      status: "error",
      message:
        err.message || "Some error occurred while retrieving study times.",
    });
  }
};

// Tạo bản ghi Study_time mới
exports.createStudyTime = async (req, res) => {
  const { user_id, course_id, startdate, enddate } = req.body;

  if (!user_id || !course_id) {
    return res
      .status(400)
      .json({ error: "User ID and Course ID are required" });
  }

  try {
    const newStudyTime = await StudyTime.create({
      user_id,
      course_id,
      startdate,
      enddate,
    });
    res.status(201).json({
      status: "success",
      data: {
        studyTime: newStudyTime,
      },
    });
  } catch (err) {
    res.status(500).send({
      status: "error",
      message:
        err.message || "Some error occurred while creating the study time.",
    });
  }
};

// Cập nhật bản ghi Study_time
exports.updateStudyTime = async (req, res) => {
  const { id } = req.params;
  const { user_id, course_id, lesson_current, startdate, enddate } = req.body;

  try {
    const studyTime = await StudyTime.findByPk(id);
    if (!studyTime) {
      return res.status(404).json({
        status: "error",
        message: "Study time not found",
      });
    }

    studyTime.user_id = user_id || studyTime.user_id;
    studyTime.course_id = course_id || studyTime.course_id;
    studyTime.lesson_current = lesson_current || studyTime.lesson_current;
    studyTime.startdate = startdate || studyTime.startdate;
    studyTime.enddate = enddate || studyTime.enddate;

    await studyTime.save();
    res.status(200).json({
      status: "success",
      data: {
        studyTime,
      },
    });
  } catch (err) {
    res.status(500).send({
      status: "error",
      message:
        err.message || "Some error occurred while updating the study time.",
    });
  }
};

// Xóa bản ghi Study_time
exports.deleteStudyTime = async (req, res) => {
  const { id } = req.params;
  try {
    const studyTime = await StudyTime.findByPk(id);
    if (!studyTime) {
      return res.status(404).json({
        status: "error",
        message: "Study time not found",
      });
    }
    await studyTime.destroy();
    res.status(204).json({
      status: "success",
      data: null,
    });
  } catch (err) {
    res.status(500).send({
      status: "error",
      message:
        err.message || "Some error occurred while deleting the study time.",
    });
  }
};
