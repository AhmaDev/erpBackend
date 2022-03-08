const portalConnection = require('../helpers/studentsDatabase.config');

const Student = function (student) {
    this.studentName = student.studentName;
    this.englishName = student.englishName;
    this.mail = student.mail;
    this.dob = student.dob;
    this.sectionId = student.sectionId * 1;
    this.nationality = student.nationality;
    this.gender = student.gender;
    this.note = student.note;
    this.studyType = student.studyType;
    this.collegeNumber = student.collegeNumber;
    this.registerYearId = student.registerYearId * 1;
    this.studentStatusId = student.studentStatusId * 1;
    this.acceptedTypeId = student.acceptedTypeId * 1;
};



Student.findById = (id, result) => {
    portalConnection.query(`SELECT * FROM Student WHERE idStudent = ${id}`, (err, res) => {
        if (err) {
            console.log("Find student by ID error:", err);
            result(err, null);
            return;
        }
        if (res.length == 0) {
            result({ kind: "not_found" }, null);
        } else {
            result(null, res[0]);
        }
    })
};

Student.getAll = (queries, result) => {

    /** 
        @param {int} idStudent - EXAMPLE: 1 OR 1,2,3
        @param {String} studentName - EXAMPLE: AHMAD FARIS
        @param {int} sectionId - EXAMPLE: 31 OR 31,14
        @param {int} studyType - EXAMPLE: 0 OR 1
        @param {int} level - EXAMPLE: 1
        @param {String} class - EXAMPLE: A
        @param {int} status - EXAMPLE: 1
        @param {String} order - EXAMPLE: studentName
        @param {String} sort - EXAMPLE: ASC OR DESC *order param is reqiured
        @param {int} limit - EXAMPLE: 100
    **/

    let query = '';
    let order = '';
    let limit = '';
    let having = '';

    if (queries.idStudent != undefined) {
        query = query + ` AND idStudent IN (${queries.idStudent})`;
    }
    if (queries.studentName != undefined) {
        query = query + ` AND studentName LIKE '%${queries.studentName}%'`;
    }
    if (queries.sectionId != undefined) {
        query = query + ` AND sectionId IN (${queries.sectionId})`;
    }
    if (queries.studyType != undefined) {
        query = query + ` AND studyType IN (${queries.studyType})`;
    }
    if (queries.level != undefined) {
        having = having + ` AND level = ${queries.level}`;
    }
    if (queries.class != undefined) {
        having = having + ` AND studentClass = '${queries.class}'`;
    }
    if (queries.status != undefined) {
        having = having + ` AND studentStatusId = ${queries.status}`;
    }
    if (queries.order != undefined) {
        order = 'ORDER BY ' + queries.order + ' ' + queries.sort
    }

    if (queries.limit != undefined) {
        limit = `LIMIT ${queries.limit}`
    }
    portalConnection.query(`SELECT *, (SELECT @level := MAX(level) FROM StudentLevel WHERE StudentLevel.studentId = Student.idStudent) As level , (SELECT year FROM YearStudy WHERE idYearStudy = Student.registerYearId LIMIT 1) As enterYear, (SELECT statusName FROM StudentStatus WHERE idStudentStatus = Student.studentStatusId LIMIT 1) As studentStatusName, (SELECT @studentClass := class FROM StudentLevel WHERE StudentLevel.studentId = Student.idStudent ORDER BY level DESC LIMIT 1) As studentClass, (SELECT idStudentLevel FROM StudentLevel WHERE StudentLevel.studentId = Student.idStudent ORDER BY level DESC LIMIT 1) As studentLevelId FROM Student WHERE 1=1 ${query} ${order} ${limit} HAVING 1=1 ${having}`, (err, res) => {
        console.log(err);
        result(null, res);
    });
};

Student.update = (id, user, result) => {
    portalConnection.query(`UPDATE Student SET ? WHERE idStudent = ${id}`, user, (err, res) => {
        if (err) {
            console.log("Error while editing a Student", err);
            result(err, null);
            return;
        }
        result(null, { idUser: id, ...user });
    })
}

Student.updateClass = (id, user, result) => {
    portalConnection.query(`UPDATE StudentLevel SET ? WHERE idStudentLevel = ${id}`, user, (err, res) => {
        if (err) {
            console.log("Error while editing a StudentLevel", err);
            result(err, null);
            return;
        }
        result(null, { idStudentLevel: id, ...user });
    })
}

Student.delete = (id, result) => {
    portalConnection.query(`DELETE FROM Student WHERE idStudent = ${id}`, (err, res) => {
        if (err) {
            console.log("Error while deleting a Student", err);
            result(err, null);
            return;
        }
        result(null, { message: `Student ID ${id} has been deleted successfully` });
    });
}
module.exports = Student;