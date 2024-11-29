const Exercise = require("../models/exerciseModel");
const CourseDetail = require("../models/courseDetailModel");
const CourseModel = require("../models/courseModel");

// Lấy tất cả câu hỏi
exports.getAllExercises = async (req, res) => {
  try {
    const questions = await Exercise.findAll();
    res.status(200).json({
      status: "success",
      results: questions.length,
      data: {
        questions,
      },
    });
  } catch (err) {
    res.status(500).send({
      status: "error",
      message: err.message || "Some error occurred while retrieving questions.",
    });
  }
};

exports.getExercisesByCourseDetailId = async (req, res) => {
  const { id } = req.params;
  console.log(id);
  try {
    // Tìm các câu hỏi liên kết với `course_detail_id`
    const questions = await Exercise.findAll({
      where: { course_detail_id: id },
    });

    if (!questions || questions.length === 0) {
      return res.status(404).json({
        status: "error",
        message: "No questions found for this course detail.",
      });
    }

    // Trả về kết quả
    res.status(200).json({
      status: "success",
      results: questions.length,
      data: { questions },
    });
  } catch (err) {
    res.status(500).send({
      status: "error",
      message: err.message || "Some error occurred while retrieving questions.",
    });
  }
};

exports.getExerciseByCourseId = async (req, res) => {
  const { id } = req.params;
  console.log(id);

  try {
    const courseDetails = await Exercise.findAll({
      where: {
        course_id: id,
      },
    });

    if (courseDetails.length === 0) {
      return res.status(404).json({
        status: "error",
        message: "No course details found for this course",
      });
    }

    // Trả về kết quả
    res.status(200).json({
      status: "success",
      results: courseDetails.length,
      data: {
        courseDetails,
      },
    });
  } catch (err) {
    res.status(500).send({
      status: "error",
      message:
        err.message || "Some error occurred while retrieving course details.",
    });
  }
};

// Tạo mới câu hỏi
exports.createExercise = async (req, res) => {
  const {
    course_id,
    course_detail_id,
    question_text,
    option_a,
    option_b,
    option_c,
    option_d,
    correct_answer,
    explanation,
  } = req.body;

  if (
    !course_id ||
    !course_detail_id ||
    !question_text ||
    !option_a ||
    !option_b ||
    !option_c ||
    !option_d ||
    !correct_answer ||
    !explanation
  ) {
    return res.status(400).json({ error: "All fields are required" });
  }

  try {
    const courseDetail = await CourseDetail.findByPk(course_detail_id);
    if (!courseDetail) {
      return res.status(404).json({
        status: "error",
        message: "Course detail not found",
      });
    }

    const courseModel = await CourseModel.findByPk(course_id);
    if (!courseModel) {
      return res.status(404).json({
        status: "error",
        message: "Course detail not found",
      });
    }

    const newExercise = await Exercise.create({
      course_id,
      course_detail_id,
      question_text,
      option_a,
      option_b,
      option_c,
      option_d,
      correct_answer,
      explanation,
    });

    res.status(201).json({
      status: "success",
      data: {
        question: newExercise,
      },
    });
  } catch (err) {
    res.status(500).send({
      status: "error",
      message:
        err.message || "Some error occurred while creating the question.",
    });
  }
};

// Cập nhật câu hỏi
exports.updateExercise = async (req, res) => {
  const { id } = req.params;
  const {
    course_detail_id,
    question_text,
    option_a,
    option_b,
    option_c,
    option_d,
    correct_answer,
    explanation,
  } = req.body;

  try {
    const question = await Exercise.findByPk(id);
    if (!question) {
      return res.status(404).json({
        status: "error",
        message: "Exercise not found",
      });
    }

    const courseDetail = await CourseDetail.findByPk(course_detail_id);
    if (course_detail_id && !courseDetail) {
      return res.status(404).json({
        status: "error",
        message: "Course detail not found",
      });
    }

    question.course_id = question.course_id;
    question.course_detail_id = course_detail_id || question.course_detail_id;
    question.question_text = question_text || question.question_text;
    question.option_a = option_a || question.option_a;
    question.option_b = option_b || question.option_b;
    question.option_c = option_c || question.option_c;
    question.option_d = option_d || question.option_d;
    question.correct_answer = correct_answer || question.correct_answer;
    question.explanation = explanation || question.explanation;

    await question.save();

    res.status(200).json({
      status: "success",
      data: {
        question,
      },
    });
  } catch (err) {
    res.status(500).send({
      status: "error",
      message:
        err.message || "Some error occurred while updating the question.",
    });
  }
};

// Xóa câu hỏi
exports.deleteExercise = async (req, res) => {
  const { id } = req.params;

  try {
    const question = await Exercise.findByPk(id);
    if (!question) {
      return res.status(404).json({
        status: "error",
        message: "Exercise not found",
      });
    }

    await question.destroy();
    res.status(204).json({
      status: "success",
      data: null,
    });
  } catch (err) {
    res.status(500).send({
      status: "error",
      message:
        err.message || "Some error occurred while deleting the question.",
    });
  }
};
