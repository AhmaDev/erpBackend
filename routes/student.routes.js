var express = require('express');
var router = express.Router();
const student = require('../controllers/student.controllers');
var auth = require('../middlewares/auth.middlewares');

router.get('/students', student.findAll);
router.get('/student/:id', student.findOne);
router.put('/student/:id', auth.roles('REP'), student.updateOne);
router.put('/studentLevel/:id', auth.roles('REP'), student.updateClass);
router.delete('/student/:id', auth.roles('REP ADMIN'), student.deleteOne);

module.exports = router;
