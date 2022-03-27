const connection = require('../helpers/db.config');
const portalConnection = require('../helpers/studentsDatabase.config');

const Lesson = function (lesson) {
    this.lessonName = lesson.lessonName;
    this.secondLessonName = lesson.secondLessonName;
    this.lessonLevel = lesson.lessonLevel;
    this.sectionId = lesson.sectionId;
    this.teacherId = lesson.teacherId;
    this.lessonCredit = lesson.lessonCredit;
    this.yearStudyId = lesson.yearStudyId;
    this.createdBy = lesson.createdBy;
    this.lessonCourse = lesson.lessonCourse;
};

Lesson.create = function (newLesson, result) {
    connection.query(`INSERT INTO lesson SET ?`, newLesson, (err, res) => {
        if (err) {
            console.log("Error while adding a lesson", err);
            result(err, null);
            return;
        }
        result(null, { idLesson: res.insertId, ...newLesson });
    });
};


Lesson.getAll = function (queries, result) {

    /** 
        @param {int} sectionId - EXAMPLE: 31 OR 31,14
        @param {int} teacherId - EXAMPLE: 1 OR 1,2,3
        @param {int} yearStudyId - EXAMPLE: 1
        @param {int} lessonCourse - EXAMPLE: 1
        @param {int} level - EXAMPLE: 1
        @param {String} order - EXAMPLE: level
        @param {String} sort - EXAMPLE: ASC OR DESC *order param is reqiured
        @param {int} limit - EXAMPLE: 100
    **/

    let query = '';
    let order = '';
    let limit = '';

    if (queries.sectionId !== undefined) {
        query = query + ` AND sectionId IN (${queries.sectionId})`;
    }
    if (queries.teacherId !== undefined) {
        query = query + ` AND teacherId IN (${queries.teacherId})`;
    }
    if (queries.yearStudyId !== undefined) {
        query = query + ` AND yearStudyId = ${queries.yearStudyId}`;
    }
    if (queries.lessonCourse !== undefined) {
        query = query + ` AND lessonCourse = ${queries.lessonCourse}`;
    }
    if (queries.level !== undefined) {
        query = query + ` AND lessonLevel = ${queries.level}`;
    }

    if (queries.order != undefined) {
        order = 'ORDER BY ' + queries.order + ' ' + queries.sort
    }

    if (queries.limit != undefined) {
        limit = `LIMIT ${queries.limit}`
    }
    connection.query(`SELECT lesson.* , studentPortal.YearStudy.year , IFNULL((SELECT JSON_ARRAYAGG(JSON_OBJECT('idLessonMark', idLessonMark, 'markTypeId', markTypeId, 'markTypeName',markTypeName ,'maximumDegree', maximumDegree)) FROM lessonMark JOIN markType ON markType.idMarkType = lessonMark.markTypeId WHERE lessonMark.lessonId = lesson.idLesson),'[]') As marks FROM lesson LEFT JOIN studentPortal.YearStudy ON studentPortal.YearStudy.idYearStudy = lesson.yearStudyId WHERE 1=1 ${query} ${order} ${limit}`, (err, res) => {
        if (err) {
            console.log("Error while getting all lessons", err);
            result(err, null);
            return;
        }
        fixedJson = res.map(row => (row.marks = JSON.parse(row.marks), row));
        result(null, res);
    });
};

Lesson.findById = function (id, result) {
    connection.query(`SELECT * FROM lesson WHERE idLesson = ${id}`, (err, res) => {
        if (err) {
            console.log("Error while getting lesson by ID", err);
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


Lesson.getAllYears = function (result) {
    portalConnection.query(`SELECT * FROM YearStudy WHERE idYearStudy != 18 ORDER BY year DESC`, (err, res) => {
        if (err) {
            console.log("Error while getting All Years", err);
            result(err, null);
            return;
        }
        if (res.length == 0) {
            result({ kind: 'not_found' }, null);
        } else {
            result(null, res);
        }
    });
};


Lesson.update = function (id, data, result) {
    connection.query(`UPDATE lesson SET ? WHERE idLesson = ${id}`, data, (err, res) => {
        if (err) {
            console.log("Error while updating lesson by ID", err);
            result(err, null);
            return;
        }
        result(null, { idLesson: res.insertId, ...data });
    });
};

Lesson.delete = (id, result) => {
    connection.query(`DELETE FROM lesson WHERE idLesson = ${id}`, (err, res) => {
        if (err) {
            console.log("Error while deleting a lesson", err);
            result(err, null);
            return;
        }
        connection.query(`DELETE FROM lessonMark WHERE lessonId = ${id}`, (err, res) => {
            if (err) {
                console.log("Error while deleting a lesson", err);
                result(err, null);
                return;
            }
            connection.query(`DELETE FROM masterSheetMarks WHERE lessonId = ${id}`, (err, res) => {
                if (err) {
                    console.log("Error while deleting a lesson", err);
                    result(err, null);
                    return;
                }
                result(null, { message: `Lesson ID ${id} has been deleted successfully` });
            });
        });
    });
}

module.exports = Lesson;