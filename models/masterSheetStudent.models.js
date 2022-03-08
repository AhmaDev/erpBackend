const connection = require('../helpers/db.config');

const MasterSheetStudent = function (masterSheetStudent) {
    this.masterSheetId = masterSheetStudent.masterSheetId;
    this.studentId = masterSheetStudent.studentId;
    this.notice = masterSheetStudent.notice;
    this.createdBy = masterSheetStudent.createdBy;
};

MasterSheetStudent.create = function (newMasterSheetStudent, result) {
    connection.query(`INSERT INTO masterSheetStudent SET ?`, newMasterSheetStudent, (err, res) => {
        if (err) {
            console.log("Error while adding a MasterSheetStudent", err);
            result(err, null);
            return;
        }
        result(null, { idMasterSheetStudent: res.insertId, ...newMasterSheetStudent });
    });
};

MasterSheetStudent.getAll = function (result) {
    connection.query(`SELECT * FROM masterSheetStudent`, (err, res) => {
        if (err) {
            console.log("Error while getting all MasterSheetStudent", err);
            result(err, null);
            return;
        }
        result(null, res);
    });
};

MasterSheetStudent.findById = function (id, result) {
    connection.query(`SELECT * FROM masterSheetStudent WHERE idMasterSheetStudent = ${id}`, (err, res) => {
        if (err) {
            console.log("Error while getting MasterSheetStudent by ID", err);
            result(err, null);
            return;
        }
        if (res.length == 0) {
            result({ kind: 'not_found' }, null);
        } else {
            result(null, res[0]);
        }
    });
};


MasterSheetStudent.update = function (id, data, result) {
    connection.query(`UPDATE masterSheetStudent SET ? WHERE idMasterSheetStudent = ${id}`, data, (err, res) => {
        if (err) {
            console.log("Error while updating MasterSheetStudent by ID", err);
            result(err, null);
            return;
        }
        result(null, { idMasterSheetStudent: res.insertId, ...data });
    });
};

MasterSheetStudent.delete = function (id, result) {
    connection.query(`DELETE FROM masterSheetStudent WHERE idMasterSheetStudent = ?`, id, (err, res) => {
        if (err) {
            console.log("Error while deleting MasterSheetStudent by ID", err);
            result(err, null);
            return;
        }
        result(null, {message: `MasterSheetStudent ID ${id} has been deleted successfully`});
    })
}

module.exports = MasterSheetStudent;