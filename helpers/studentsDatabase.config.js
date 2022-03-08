var mysql = require('mysql');
require('dotenv').config()
var portalConnection = {
    host: process.env.STUDENT_DB_HOST,
    user: process.env.STUDENT_DB_USERNAME,
    password: process.env.STUDENT_DB_PASSWORD,
    database: process.env.STUDENT_DB_NAME,
    multipleStatements: true,
};
var portalConnection = mysql.createConnection(portalConnection);
module.exports = portalConnection;