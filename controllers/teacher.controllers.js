const Teacher = require("../models/teacher.models");
require("dotenv").config();

exports.create = (req, res) => {
  if (!req.body) {
    res.status(400).send({
      message: "Body is empty",
    });
  }
  const teacher = new Teacher({
    teacherName: req.body.teacherName,
    sectionId: req.body.sectionId,
  });

  Teacher.create(teacher, (err, data) => {
    if (err) res.sendStatus(500);
    else res.send(data);
  });
};

exports.findAll = (req, res) => {
  Teacher.getAll((err, data) => {
    if (err) res.sendStatus(500);
    else res.send(data);
  });
};

exports.updateOne = (req, res) => {
  Teacher.update(req.params.id, req.body, (err, data) => {
    if (err) res.sendStatus(500);
    else res.send(data);
  });
};

exports.deleteOne = (req, res) => {
  Teacher.delete(req.params.id, (err, data) => {
    if (err) res.sendStatus(500);
    else res.send(data);
  });
};
