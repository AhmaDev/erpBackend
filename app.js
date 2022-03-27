var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var cors = require('cors');
const history = require("connect-history-api-fallback");
var app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(
   history({
      disableDotRule: true,
      verbose: true,
   })
);
app.use(express.static(path.join(__dirname, 'public')));
app.use(cors());

var apiBaseUrl = '/api/';

app.use(apiBaseUrl, require('./routes/index'));
app.use(apiBaseUrl, require('./routes/user.routes'));
app.use(apiBaseUrl, require('./routes/student.routes'));
app.use(apiBaseUrl, require('./routes/masterSheet.routes'));
app.use(apiBaseUrl, require('./routes/lesson.routes'));
app.use(apiBaseUrl, require('./routes/lessonMark.routes'));
app.use(apiBaseUrl, require('./routes/levelType.routes'));
app.use(apiBaseUrl, require('./routes/masterSheetMarks.routes'));
app.use(apiBaseUrl, require('./routes/masterSheetStudent.routes'));

module.exports = app;
