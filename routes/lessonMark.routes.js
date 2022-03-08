var express = require('express');
var router = express.Router();
const lessonMark = require('../controllers/lessonMark.controllers');
var auth = require('../middlewares/auth.middlewares');

router.get('/lessonMarks/', lessonMark.findAll);
router.get('/markTypes/', lessonMark.findAllMarkTypes);
router.post('/addLessonMark/', auth.roles('REP'), lessonMark.create);
router.get('/lessonMark/:id', lessonMark.findOne);
router.put('/lessonMark/:id', auth.roles('REP'), lessonMark.updateOne);
router.delete('/lessonMark/:id', auth.roles('REP'), lessonMark.deleteOne);

module.exports = router;
