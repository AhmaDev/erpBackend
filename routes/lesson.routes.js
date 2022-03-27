var express = require('express');
var router = express.Router();
const lesson = require('../controllers/lesson.controllers');
var auth = require('../middlewares/auth.middlewares');

router.get('/lessons/', lesson.findAll);
router.get('/yearStudies/', lesson.findAllYears);
router.post('/addLesson/', auth.roles('REP'), lesson.create);
router.get('/lesson/:id', lesson.findOne);
router.put('/lesson/:id', auth.roles('REP'), lesson.updateOne);
router.delete('/lesson/:id', auth.roles('REP'), lesson.deleteOne);

module.exports = router;
