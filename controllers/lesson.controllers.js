const Lesson = require("../models/lesson.models");

exports.create = (req, res) => {
  if (!req.body) {
    res.status(400).send({
      message: "Body is empty",
    });
  }
  const lesson = new Lesson({
    lessonName: req.body.lessonName,
    secondLessonName: req.body.secondLessonName,
    lessonLevel: req.body.lessonLevel,
    sectionId: req.body.sectionId,
    teacherId: req.body.teacherId,
    lessonCredit: req.body.lessonCredit,
    yearStudyId: req.body.yearStudyId,
    createdBy: req.body.createdBy,
    lessonCourse: req.body.lessonCourse,
    scheduleTeacherId: req.body.scheduleTeacherId,
    practicalGroupId: req.body.practicalGroupId,
  });

  Lesson.create(lesson, (err, data) => {
    if (err) res.sendStatus(500);
    else res.send(data);
  });
};

exports.findAll = (req, res) => {
  Lesson.getAll(req.query, (err, data) => {
    if (err) res.sendStatus(500);
    else res.send(data);
  });
};
exports.findAllLessonsForSchedule = (req, res) => {
  Lesson.findAllLessonsForSchedule(req.query, (err, data) => {
    if (err) res.sendStatus(500);
    else res.send(data);
  });
};

exports.findOne = (req, res) => {
  Lesson.findById(req.params.id, (err, data) => {
    if (err) {
      if (err.kind == "not_found") res.sendStatus(404);
      else res.sendStatus(500);
    } else res.send(data);
  });
};

exports.findAllYears = (req, res) => {
  Lesson.getAllYears((err, data) => {
    if (err) res.sendStatus(500);
    else res.send(data);
  });
};

exports.updateOne = (req, res) => {
  Lesson.update(req.params.id, req.body, (err, data) => {
    if (err) res.sendStatus(500);
    else res.send(data);
  });
};

exports.deleteOne = (req, res) => {
  Lesson.delete(req.params.id, (err, data) => {
    if (err) res.sendStatus(500);
    else res.send(data);
  });
};
