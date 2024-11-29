const express = require("express");
const router = express.Router();
const exerciseController = require("../controllers/exerciseController");

router.get("/", exerciseController.getAllExercises);
router.get(
  "/course-detail/:id",
  exerciseController.getExercisesByCourseDetailId
);
router.get("/course/:id", exerciseController.getExerciseByCourseId);

router.post("/", exerciseController.createExercise);

router.put("/:id", exerciseController.updateExercise);

router.delete("/:id", exerciseController.deleteExercise);

module.exports = router;
