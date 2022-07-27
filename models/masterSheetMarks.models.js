const res = require("express/lib/response");
const connection = require("../helpers/db.config");

const MasterSheetMarks = function (masterSheetMarks) {
  this.masterSheetId = masterSheetMarks.masterSheetId;
  this.studentId = masterSheetMarks.studentId;
  this.masterSheetMarkTypeId = masterSheetMarks.masterSheetMarkTypeId;
  this.degree = masterSheetMarks.degree;
  this.lessonId = masterSheetMarks.lessonId;
  this.markStatusId = masterSheetMarks.markStatusId;
  this.createdBy = masterSheetMarks.createdBy;
};

MasterSheetMarks.create = function (newMasterSheetMarks, result) {
  connection.query(
    `SELECT * FROM masterSheetMarks WHERE lessonId = ? AND studentId = ? AND masterSheetId = ? AND masterSheetMarkTypeId = ?`,
    [
      newMasterSheetMarks.lessonId,
      newMasterSheetMarks.studentId,
      newMasterSheetMarks.masterSheetId,
      newMasterSheetMarks.masterSheetMarkTypeId,
    ],
    (err, res) => {
      if (res.length > 0) {
        connection.query(
          `UPDATE masterSheetMarks SET ? WHERE idMasterSheetMarks = ${res[0].idMasterSheetMarks}`,
          newMasterSheetMarks,
          (err, res) => {
            if (err) {
              console.log("Error while adding a MasterSheetMarks", err);
              result(err, null);
              return;
            }
            result(null, {
              idMasterSheetMarks: res.insertId,
              ...newMasterSheetMarks,
            });
          },
        );
      } else {
        connection.query(
          `INSERT INTO masterSheetMarks SET ?`,
          newMasterSheetMarks,
          (err, res) => {
            if (err) {
              console.log("Error while adding a MasterSheetMarks", err);
              result(err, null);
              return;
            }
            result(null, {
              idMasterSheetMarks: res.insertId,
              ...newMasterSheetMarks,
            });
          },
        );
      }
    },
  );
};

MasterSheetMarks.multiCreate = function (newMasterSheetMarks, result) {
  let marks = newMasterSheetMarks.map((e) => [
    e.masterSheetId,
    e.studentId,
    e.masterSheetMarkTypeId,
    e.degree,
    e.lessonId,
    e.markStatusId,
    e.createdBy,
  ]);
  connection.query(
    `INSERT IGNORE INTO masterSheetMarks (masterSheetId,studentId,masterSheetMarkTypeId,degree,lessonId,markStatusId,createdBy) VALUES ?`,
    [marks],
    (err, resultApp) => {
      if (err) {
        console.log("Error while adding a MasterSheetMarks", err);
        result(err, null);
        return;
      }
      result(null, {
        message: "success",
      });
    },
  );
};
MasterSheetMarks.getAll = function (result) {
  connection.query(`SELECT * FROM masterSheetMarks`, (err, res) => {
    if (err) {
      console.log("Error while getting all MasterSheetMarks", err);
      result(err, null);
      return;
    }
    result(null, res);
  });
};

MasterSheetMarks.getAllForDocuments = function (collegeNumbers, result) {
  let fields = `'idMasterSheetMarks', idMasterSheetMarks, 'studentId', studentId, 'masterSheetMarkTypeId',masterSheetMarkTypeId ,'degree', degree, 'lessonId', lessonId, 'isFinal', isFinal, 'markStatusId', markStatusId, 'lessonName', lessonName, 'lessonCredit',lessonCredit, 'studyType', studyType, 'studyYearId', studyYearId, 'studyYear', (SELECT year FROM studentPortal.YearStudy WHERE studentPortal.YearStudy.idYearStudy = studyYearId), 'isCourses', (SELECT IF(levelType.masterSheetStudyTypeId = 1, false, true) FROM levelType WHERE levelType.level = masterSheet.studyLevel AND levelType.sectionId = masterSheet.sectionId AND levelType.studyYearId = masterSheet.studyYearId LIMIT 1), 'lessonCourse', (SELECT lessonCourse FROM lesson WHERE lesson.idLesson = lessonId)`;

  let levelOneQuery = `(SELECT JSON_ARRAYAGG(JSON_OBJECT(${fields})) FROM masterSheetMarks JOIN masterSheet ON masterSheet.idMasterSheet = masterSheetMarks.masterSheetId JOIN markType ON markType.idMarkType = masterSheetMarks.masterSheetMarkTypeId JOIN lesson ON lesson.idLesson = masterSheetMarks.lessonId WHERE masterSheetMarks.studentId = idStudent AND masterSheet.studyLevel = 1)`;
  let levelTwoQuery = `(SELECT JSON_ARRAYAGG(JSON_OBJECT(${fields})) FROM masterSheetMarks JOIN masterSheet ON masterSheet.idMasterSheet = masterSheetMarks.masterSheetId JOIN markType ON markType.idMarkType = masterSheetMarks.masterSheetMarkTypeId JOIN lesson ON lesson.idLesson = masterSheetMarks.lessonId WHERE masterSheetMarks.studentId = idStudent AND masterSheet.studyLevel = 2)`;
  let levelThreeQuery = `(SELECT JSON_ARRAYAGG(JSON_OBJECT(${fields})) FROM masterSheetMarks JOIN masterSheet ON masterSheet.idMasterSheet = masterSheetMarks.masterSheetId JOIN markType ON markType.idMarkType = masterSheetMarks.masterSheetMarkTypeId JOIN lesson ON lesson.idLesson = masterSheetMarks.lessonId WHERE masterSheetMarks.studentId = idStudent AND masterSheet.studyLevel = 3)`;
  let levelFourQuery = `(SELECT JSON_ARRAYAGG(JSON_OBJECT(${fields})) FROM masterSheetMarks JOIN masterSheet ON masterSheet.idMasterSheet = masterSheetMarks.masterSheetId JOIN markType ON markType.idMarkType = masterSheetMarks.masterSheetMarkTypeId JOIN lesson ON lesson.idLesson = masterSheetMarks.lessonId WHERE masterSheetMarks.studentId = idStudent AND masterSheet.studyLevel = 4)`;
  let levelFiveQuery = `(SELECT JSON_ARRAYAGG(JSON_OBJECT(${fields})) FROM masterSheetMarks JOIN masterSheet ON masterSheet.idMasterSheet = masterSheetMarks.masterSheetId JOIN markType ON markType.idMarkType = masterSheetMarks.masterSheetMarkTypeId JOIN lesson ON lesson.idLesson = masterSheetMarks.lessonId WHERE masterSheetMarks.studentId = idStudent AND masterSheet.studyLevel = 5)`;
  connection.query(
    `SELECT idStudent, studentName, collegeNumber , ${levelOneQuery} As level1, ${levelTwoQuery} As level2, ${levelThreeQuery} As level3, ${levelFourQuery} As level4, ${levelFiveQuery} As level5 FROM studentPortal.Student WHERE collegeNumber IN (${collegeNumbers})`,
    (err, res) => {
      if (err) {
        console.log("Error while getting all MasterSheetMarks", err);
        result(err, null);
        return;
      }
      for (let i = 0; i < res.length; i++) {
        if (res[i].level1 != null) {
          res[i].level1 = JSON.parse(res[i].level1);
        }
        if (res[i].level2 != null) {
          res[i].level2 = JSON.parse(res[i].level2);
        }
        if (res[i].level3 != null) {
          res[i].level3 = JSON.parse(res[i].level3);
        }
        if (res[i].level4 != null) {
          res[i].level4 = JSON.parse(res[i].level4);
        }
        if (res[i].level5 != null) {
          res[i].level5 = JSON.parse(res[i].level5);
        }
      }
      result(null, res);
    },
  );
};

MasterSheetMarks.getAllMarkStatus = function (result) {
  connection.query(`SELECT * FROM markStatus`, (err, res) => {
    if (err) {
      console.log("Error while getting all MasterSheetMarks", err);
      result(err, null);
      return;
    }
    result(null, res);
  });
};

MasterSheetMarks.findById = function (id, result) {
  connection.query(
    `SELECT * FROM masterSheetMarks WHERE idMasterSheetMarks = ${id}`,
    (err, res) => {
      if (err) {
        console.log("Error while getting MasterSheetMarks by ID", err);
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

MasterSheetMarks.update = function (id, data, result) {
  connection.query(
    `UPDATE masterSheetMarks SET ? WHERE idMasterSheetMarks = ${id}`,
    data,
    (err, res) => {
      if (err) {
        console.log("Error while updating MasterSheetMarks by ID", err);
        result(err, null);
        return;
      }
      result(null, { idMasterSheetMarks: res.insertId, ...data });
    },
  );
};

MasterSheetMarks.multiUpdate = function (id, data, result) {
  connection.query(
    `UPDATE masterSheetMarks SET ? WHERE idMasterSheetMarks IN (${id})`,
    data,
    (err, res) => {
      if (err) {
        console.log("Error while updating MasterSheetMarks by ID", err);
        result(err, null);
        return;
      }
      result(null, { idMasterSheetMarks: res.insertId, ...data });
    },
  );
};

MasterSheetMarks.delete = function (id, result) {
  connection.query(
    `DELETE FROM masterSheetMarks WHERE idMasterSheetMarks = ?`,
    id,
    (err, res) => {
      if (err) {
        console.log("Error while deleting MasterSheetMarks by ID", err);
        result(err, null);
        return;
      }
      result(null, {
        message: `MasterSheetMarks ID ${id} has been deleted successfully`,
      });
    },
  );
};

module.exports = MasterSheetMarks;
