const connection = require("../helpers/db.config");

const LessonMark = function (lessonMark) {
  this.lessonId = lessonMark.lessonId;
  this.markTypeId = lessonMark.markTypeId;
  this.maximumDegree = lessonMark.maximumDegree;
  this.createdBy = lessonMark.createdBy;
};

LessonMark.create = function (newLessonMark, result) {
  connection.query(
    `INSERT INTO lessonMark SET ?`,
    newLessonMark,
    (err, res) => {
      if (err) {
        console.log("Error while adding a lessonMark", err);
        result(err, null);
        return;
      }
      result(null, { idLessonMark: res.insertId, ...newLessonMark });
    },
  );
};

LessonMark.getAll = function (result) {
  connection.query(`SELECT * FROM lessonMark`, (err, res) => {
    if (err) {
      console.log("Error while getting all lessonMarks", err);
      result(err, null);
      return;
    }
    result(null, res);
  });
};

LessonMark.getAllMarkTypes = function (result) {
  connection.query(`SELECT * FROM markType WHERE isHidden = 0`, (err, res) => {
    if (err) {
      console.log("Error while getting all markTypes", err);
      result(err, null);
      return;
    }
    result(null, res);
  });
};

LessonMark.getAllMarkTypesWithHidden = function (result) {
  connection.query(`SELECT * FROM markType`, (err, res) => {
    if (err) {
      console.log("Error while getting all markTypes", err);
      result(err, null);
      return;
    }
    result(null, res);
  });
};

LessonMark.findById = function (id, result) {
  connection.query(
    `SELECT * FROM lessonMark WHERE idLessonMark = ${id}`,
    (err, res) => {
      if (err) {
        console.log("Error while getting lessonMark by ID", err);
        result(err, null);
        return;
      }
      if (res.length == 0) {
        result({ kind: "not_found" }, null);
      } else {
        result(null, res[0]);
      }
    },
  );
};

LessonMark.update = function (id, data, result) {
  connection.query(
    `UPDATE lessonMark SET ? WHERE idLessonMark = ${id}`,
    data,
    (err, res) => {
      if (err) {
        console.log("Error while updating LessonMark by ID", err);
        result(err, null);
        return;
      }
      result(null, { idLessonMark: res.insertId, ...data });
    },
  );
};

LessonMark.delete = function (id, result) {
  connection.query(
    `DELETE FROM lessonMark WHERE idLessonMark = ?`,
    id,
    (err, res) => {
      if (err) {
        console.log("Error while deleting LessonMark by ID", err);
        result(err, null);
        return;
      }
      result(null, {
        message: `LessonMark ID ${id} has been deleted successfully`,
      });
    },
  );
};

module.exports = LessonMark;
