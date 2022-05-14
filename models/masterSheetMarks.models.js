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
