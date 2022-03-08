var express = require('express');
var router = express.Router();
const masterSheetStudent = require('../controllers/masterSheetStudent.controllers');
var auth = require('../middlewares/auth.middlewares');

router.get('/masterSheetStudents/', masterSheetStudent.findAll);
router.post('/addMasterSheetStudent/', auth.roles('REP'), masterSheetStudent.create);
router.get('/masterSheetStudent/:id', masterSheetStudent.findOne);
router.put('/masterSheetStudent/:id', auth.roles('REP'), masterSheetStudent.updateOne);
router.delete('/masterSheetStudent/:id', auth.roles('REP'), masterSheetStudent.deleteOne);

module.exports = router;
