const connection = require('../helpers/db.config');

const LevelType = function (levelType) {
    this.level = levelType.level;
    this.sectionId = levelType.sectionId;
    this.masterSheetStudyTypeId = levelType.masterSheetStudyTypeId;
    this.studyYearId = levelType.studyYearId;
    this.createdBy = levelType.createdBy;
};

LevelType.create = function (newLevelType, result) {
    connection.query(`INSERT INTO levelType SET ?`, newLevelType, (err, res) => {
        if (err) {
            console.log("Error while adding a LevelType", err);
            result(err, null);
            return;
        }
        result(null, { idLevelType: res.insertId, ...newLevelType });
    });
};

LevelType.getAll = function (queries,result) {

    let query = '';
    let order = '';
    let limit = '';

    if (queries.year !== undefined) {
        query = query + ` AND studyYearId IN (${queries.year})`;
    }

    if (queries.level !== undefined) {
        query = query + ` AND level IN (${queries.level})`;
    }

    connection.query(`SELECT * FROM levelType WHERE 1=1 ${query} ${order} ${limit}`, (err, res) => {
        if (err) {
            console.log("Error while getting all LevelType", err);
            result(err, null);
            return;
        }
        result(null, res);
    });
};

LevelType.getAllBySectionId = function (id, queries, result) {
    /** 
       @param {int} sectionId - EXAMPLE: 31 OR 31,14
   **/

    let query = '';

    if (queries.year !== undefined) {
        query = query + ` AND studyYearId = ${queries.year}`;
    }
    if (queries.level !== undefined) {
        query = query + ` AND level = ${queries.level}`;
    }
    connection.query(`SELECT * FROM levelType WHERE sectionId = ${id} ${query}`, (err, res) => {
        if (err) {
            console.log("Error while getting all LevelType", err);
            result(err, null);
            return;
        }
        result(null, res);
    });
};

LevelType.findById = function (id, result) {
    connection.query(`SELECT * FROM levelType WHERE idLevelType = ${id}`, (err, res) => {
        if (err) {
            console.log("Error while getting LevelType by ID", err);
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


LevelType.update = function (id, data, result) {
    connection.query(`UPDATE levelType SET ? WHERE idLevelType = ${id}`, data, (err, res) => {
        if (err) {
            console.log("Error while updating LevelType by ID", err);
            result(err, null);
            return;
        }
        result(null, { idLevelType: res.insertId, ...data });
    });
};

LevelType.delete = function (id, result) {
    connection.query(`DELETE FROM levelType WHERE idLevelType = ?`, id, (err, res) => {
        if (err) {
            console.log("Error while deleting LevelType by ID", err);
            result(err, null);
            return;
        }
        result(null, { message: `LevelType ID ${id} has been deleted successfully` });
    })
}

module.exports = LevelType;