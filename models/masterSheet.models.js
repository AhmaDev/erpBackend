const connection = require("../helpers/db.config");

const MasterSheet = function (masterSheet) {
  this.sectionId = masterSheet.sectionId;
  this.studyLevel = masterSheet.studyLevel;
  this.studyClass = masterSheet.studyClass;
  this.studyYearId = masterSheet.studyYearId;
  this.studyType = masterSheet.studyType;
  this.masterSheetTypeId = masterSheet.masterSheetTypeId;
  this.masterSheetStudyTypeId = masterSheet.masterSheetStudyTypeId;
  this.masterSheetNotice = masterSheet.masterSheetNotice;
  this.createdBy = masterSheet.createdBy;
};

MasterSheet.create = function (newMasterSheet, result) {
  connection.query(
    `INSERT INTO masterSheet SET ?`,
    newMasterSheet,
    (err, res) => {
      if (err) {
        console.log("Error while adding a masterSheet", err);
        result(err, null);
        return;
      }
      result(null, { idMasterSheet: res.insertId, ...newMasterSheet });
    },
  );
};

MasterSheet.getAll = function (queries, result) {
  /** 
        @param {int} sectionId - EXAMPLE: 31 OR 31,14
        @param {int} level - EXAMPLE: 1 OR 1,2,3
        @param {String} class - EXAMPLE: A
        @param {int} year - EXAMPLE: 1
        @param {String} studyType - EXAMPLE: morningStudy OR eveningStudy
        @param {int} masterSheetTypeId - EXAMPLE: 1
        @param {String} order - EXAMPLE: studyLevel
        @param {String} sort - EXAMPLE: ASC OR DESC *order param is reqiured
        @param {int} limit - EXAMPLE: 100
    **/

  let query = "";
  let order = "";
  let limit = "";

  if (queries.sectionId !== undefined) {
    query = query + ` AND sectionId IN (${queries.sectionId})`;
  }

  if (queries.level !== undefined) {
    query = query + ` AND studyLevel IN (${queries.level})`;
  }

  if (queries.class !== undefined) {
    query = query + ` AND studyClass = '${queries.class}'`;
  }

  if (queries.year !== undefined) {
    query = query + ` AND studyYearId = ${queries.year}`;
  }

  if (queries.studyType !== undefined) {
    query = query + ` AND studyType = '${queries.studyType}'`;
  }

  if (queries.masterSheetTypeId !== undefined) {
    query = query + ` AND masterSheetTypeId = ${queries.masterSheetTypeId}`;
  }

  if (queries.order != undefined) {
    order = "ORDER BY " + queries.order + " " + queries.sort;
  }

  if (queries.limit != undefined) {
    limit = `LIMIT ${queries.limit}`;
  }

  connection.query(
    `SELECT masterSheet.*, masterSheetType.*,  (SELECT masterSheetStudyTypeId FROM levelType WHERE sectionId = masterSheet.sectionId AND level = masterSheet.studyLevel AND studyYearId = masterSheet.studyYearId LIMIT 1) As levelType, IF((SELECT masterSheetStudyTypeId FROM levelType WHERE sectionId = masterSheet.sectionId AND level = masterSheet.studyLevel AND studyYearId = masterSheet.studyYearId LIMIT 1) = 2 ,"النظام الفصلي","النظام السنوي") As masterSheetStudyTypeName FROM masterSheet LEFT JOIN masterSheetType ON masterSheetType.idMasterSheetType = masterSheet.masterSheetTypeId LEFT JOIN masterSheetStudyType ON masterSheetStudyType.idMasterSheetStudyType = masterSheet.masterSheetStudyTypeId WHERE 1=1 ${query} ${order} ${limit}`,
    (err, res) => {
      if (err) {
        console.log("Error while getting all masterSheet", err);
        result(err, null);
        return;
      }
      result(null, res);
    },
  );
};

MasterSheet.getAllByTeacherId = function (id, queries, result) {
  connection.query(
    `SELECT * FROM lesson WHERE teacherId = ${id} AND yearStudyId = ${queries.year} GROUP BY sectionId,lessonLevel`,
    (err, res) => {
      if (err) {
        console.log("Error while getting all masterSheet", err);
        result(err, null);
        return;
      }
      var sections =
        res.length > 0
          ? JSON.stringify(res.map((e) => e.sectionId)).slice(1, -1)
          : 0;
      var levels =
        res.length > 0
          ? JSON.stringify(res.map((e) => e.lessonLevel)).slice(1, -1)
          : 0;
      connection.query(
        `SELECT * FROM masterSheet LEFT JOIN masterSheetType ON masterSheetType.idMasterSheetType = masterSheet.masterSheetTypeId LEFT JOIN masterSheetStudyType ON masterSheetStudyType.idMasterSheetStudyType = masterSheet.masterSheetStudyTypeId WHERE studyLevel IN (${levels}) AND sectionId IN (${sections})`,
        (err, res) => {
          if (err) {
            console.log("Error while getting all masterSheet", err);
            result(err, null);
            return;
          }
          result(null, res);
        },
      );
    },
  );
};

MasterSheet.findById = function (id, result) {
  //   RESULT SHOULD BE LIKE THIS:
  //   {
  //    ..masterSheet
  //    lessons: [{
  //        ..lesson
  //        marks: { ..marks }
  //    }]
  //    students: [{
  //        ..student
  //        marks: { ..marks }
  //    }]
  //   }

  // GET ALL MARKS FOR EACH LESSON THEN ATTACH IT TO LESSONS SUB QUERY
  let lessonMarksSubQuery = `(SELECT JSON_ARRAYAGG(JSON_OBJECT('idLessonMark', idLessonMark, 'markTypeId', markTypeId, 'markTypeName',markTypeName ,'maximumDegree', maximumDegree, 'isFinal', isFinal)) FROM lessonMark JOIN markType ON markType.idMarkType = lessonMark.markTypeId WHERE lessonMark.lessonId = lesson.idLesson)`;

  // GET ALL LESSONS FOR SELECTED MASTERSHEET
  let lessonsSubQuery = `(SELECT IFNULL(JSON_ARRAYAGG(JSON_OBJECT('idLesson', idLesson, 'lessonName', lessonName, 'secondLessonName', secondLessonName, 'lessonCredit', lessonCredit, 'marks', ${lessonMarksSubQuery})),'[]') FROM lesson WHERE lesson.lessonLevel = masterSheet.studyLevel AND lesson.sectionId = masterSheet.sectionId AND lesson.yearStudyId = masterSheet.studyYearId AND lesson.lessonCourse = masterSheet.masterSheetStudyTypeId ORDER BY lesson.lessonCredit DESC) As lessons`;

  // GET ALL MARKS FOR EACH STUDENT THEN ATTACH IT TO STUDENTS SUB QUERY
  let studentMarksSubQuery = `(SELECT JSON_ARRAYAGG(JSON_OBJECT('idMasterSheetMarks', idMasterSheetMarks, 'studentId', studentId, 'masterSheetMarkTypeId',masterSheetMarkTypeId ,'degree', degree, 'lessonId', lessonId, 'isFinal', isFinal, 'markStatusId', markStatusId)) FROM masterSheetMarks JOIN markType ON markType.idMarkType = masterSheetMarks.masterSheetMarkTypeId WHERE masterSheetMarks.studentId = masterSheetStudent.studentId AND masterSheetMarks.masterSheetId = masterSheet.idMasterSheet)`;

  // GET ALL STUDENTS FOR SELECTED MASTERSHEET
  let studentsSubQuery = `(SELECT IFNULL(JSON_ARRAYAGG(JSON_OBJECT('idMasterSheetStudent', idMasterSheetStudent,'studentId',studentId,'studentName',Student.studentName,'studentCollegeNumber', Student.collegeNumber , 'gender', Student.gender , 'studentEmail', Student.mail ,'notice', notice, 'marks', ${studentMarksSubQuery})),'[]') FROM masterSheetStudent JOIN studentPortal.Student ON studentPortal.Student.idStudent = masterSheetStudent.studentId WHERE masterSheetStudent.masterSheetId = masterSheet.idMasterSheet) As students`;

  // FINAL QUERY
  connection.query(
    `SELECT masterSheet.*, Section.sectionName, masterSheetType.*,(SELECT masterSheetStudyType.masterSheetStudyTypeName FROM levelType JOIN masterSheetStudyType ON masterSheetStudyType.idMasterSheetStudyType = levelType.masterSheetStudyTypeId WHERE levelType.level = masterSheet.studyLevel AND levelType.sectionId = masterSheet.sectionId AND levelType.studyYearId = masterSheet.studyYearId LIMIT 1) As masterSheetStudyTypeName , (SELECT IF(levelType.masterSheetStudyTypeId = 1, false, true) FROM levelType WHERE levelType.level = masterSheet.studyLevel AND levelType.sectionId = masterSheet.sectionId AND levelType.studyYearId = masterSheet.studyYearId LIMIT 1) As isCourses , YearStudy.year As yearName,  ${lessonsSubQuery}, ${studentsSubQuery} FROM masterSheet LEFT JOIN studentPortal.Section ON Section.idSection = sectionId LEFT JOIN studentPortal.YearStudy ON YearStudy.idYearStudy = masterSheet.studyYearId LEFT JOIN masterSheetType ON masterSheetType.idMasterSheetType = masterSheet.masterSheetTypeId  WHERE idMasterSheet = ${id}`,
    (err, res) => {
      if (err) {
        console.log("Error while getting masterSheet by ID", err);
        result(err, null);
        return;
      }
      if (res.length == 0) {
        result({ kind: "not_found" }, null);
      } else {
        res[0].lessons = JSON.parse(res[0].lessons);
        res[0].students = JSON.parse(res[0].students);
        result(null, res[0]);
      }
    },
  );
};

MasterSheet.findBySectionId = function (id, result) {
  connection.query(
    `SELECT * FROM masterSheet WHERE sectionId = ${id}`,
    (err, res) => {
      if (err) {
        console.log("Error while getting masterSheet by ID", err);
        result(err, null);
        return;
      }
      if (res.length == 0) {
        result({ kind: "not_found" }, null);
      } else {
        result(null, res);
      }
    },
  );
};

MasterSheet.getAllMasterSheetTypes = function (result) {
  connection.query(`SELECT * FROM masterSheetType`, (err, res) => {
    if (err) {
      console.log("Error while getting masterSheet by ID", err);
      result(err, null);
      return;
    }
    if (res.length == 0) {
      result({ kind: "not_found" }, null);
    } else {
      result(null, res);
    }
  });
};

MasterSheet.update = function (id, data, result) {
  connection.query(
    `UPDATE masterSheet SET ? WHERE idMasterSheet = ${id}`,
    data,
    (err, res) => {
      if (err) {
        console.log("Error while updating masterSheet by ID", err);
        result(err, null);
        return;
      }
      result(null, { idStaff: res.insertId, ...data });
    },
  );
};

MasterSheet.delete = function (id, result) {
  connection.query(
    `DELETE FROM masterSheet WHERE idMasterSheet = ?`,
    id,
    (err, res) => {
      if (err) {
        console.log("Error while deleting masterSheet by ID", err);
        result(err, null);
        return;
      }
      connection.query(
        `DELETE FROM masterSheetMarks WHERE masterSheetId = ?`,
        id,
        (err, res) => {
          if (err) {
            console.log("Error while deleting masterSheet by ID", err);
            result(err, null);
            return;
          }
          connection.query(
            `DELETE FROM masterSheetStudent WHERE masterSheetId = ?`,
            id,
            (err, res) => {
              if (err) {
                console.log("Error while deleting masterSheet by ID", err);
                result(err, null);
                return;
              }
              result(null, {
                message: `MasterSheet ID ${id} has been deleted successfully`,
              });
            },
          );
        },
      );
    },
  );
};

module.exports = MasterSheet;
