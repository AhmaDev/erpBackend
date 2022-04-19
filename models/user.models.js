const portalConnection = require('../helpers/studentsDatabase.config');

const User = function (user) {
    this.userName = User.userName;
    this.password = User.password;
    this.roleId = User.roleId;
    this.sectionId = User.sectionId;
};


User.login = (loginInfo, result) => {
    portalConnection.query(`SELECT idUser, userName, roleId, roleName, sectionName,sectionId, (SELECT year FROM YearStudy WHERE currentYear = 1 LIMIT 1) As currentYear,  (SELECT idYearStudy FROM YearStudy WHERE currentYear = 1 LIMIT 1) As yearStudyId FROM User JOIN Role ON User.roleId = Role.idRole LEFT JOIN Section ON User.sectionId = Section.idSection WHERE userName = '${loginInfo.userName}' AND password = '${loginInfo.password}'`, (err, res) => {
        if (err) {
            console.log("Login error:", err);
            result(err, null);
            return;
        }
        if (res.length == 0) {
            result({ kind: "not_found" }, null);
        } else {
            result(null, res[0]);
        }
    });
};


User.create = (newUser, result) => {
    portalConnection.query(`INSERT INTO user SET ?`, newUser, (err, res) => {
        if (err) {
            console.log("Add user error:", err);
            result(err, null);
            return;
        }
        result(null, { idUser: res.insertId, ...newUser })
    })
};

User.findById = (id, result) => {
    portalConnection.query(`SELECT idUser, userName, roleId, roleName, sectionName, sectionId FROM User JOIN Role ON User.roleId = Role.idRole LEFT JOIN Section ON User.sectionId = Section.idSection WHERE idUser = ${id}`, (err, res) => {
        if (err) {
            console.log("Find user by ID error:", err);
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

User.getAll = (result) => {
    portalConnection.query(`SELECT idUser, userName, roleId, roleName, sectionName, sectionId FROM User JOIN Role ON User.roleId = Role.idRole LEFT JOIN Section ON User.sectionId = Section.idSection`, (err, res) => {
        result(null, res);
    });
};


User.getSettings = (variable, result) => {
    connection.query(`SELECT settings.value FROM settings WHERE variable = ?`, [variable], (err, res) => {
        if (res.length > 0) {
            result(null, res[0]);
        } else {
            result(err, null);
        }
    });
};

User.update = (id, user, result) => {
    portalConnection.query(`UPDATE user SET ? WHERE idUser = ${id}`, user, (err, res) => {
        if (err) {
            console.log("Error while editing a user", err);
            result(err, null);
            return;
        }
        result(null, { idUser: id, ...user });
    })
}

User.delete = (id, result) => {
    portalConnection.query(`DELETE FROM User WHERE idUser = ${id}`, (err, res) => {
        if (err) {
            console.log("Error while deleting a user", err);
            result(err, null);
            return;
        }
        result(null, { message: `User ID ${id} has been deleted successfully` });
    });
}
module.exports = User;