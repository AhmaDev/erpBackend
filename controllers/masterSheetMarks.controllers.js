
const MasterSheetMarks = require('../models/masterSheetMarks.models');

exports.create = (req, res) => {
    if (!req.body) {
        res.status(400).send({
            message: "Body is empty"
        });
    }
    const masterSheetMarks = new MasterSheetMarks({
        masterSheetId: req.body.masterSheetId,
        studentId: req.body.studentId,
        masterSheetMarkTypeId: req.body.masterSheetMarkTypeId,
        degree: req.body.degree,
        lessonId: req.body.lessonId,
        markStatusId: req.body.markStatusId,
        createdBy: req.body.createdBy,
    });

    MasterSheetMarks.create(masterSheetMarks, (err, data) => {
        if (err) res.sendStatus(500);
        else res.send(data);
    })
};

exports.findAll = (req, res) => {
    MasterSheetMarks.getAll((err, data) => {
        if (err) res.sendStatus(500);
        else res.send(data);
    });
};

exports.findOne = (req, res) => {
    MasterSheetMarks.findById(req.params.id, (err, data) => {
        if (err) {
            if (err.kind == "not_found") res.sendStatus(404);
            else res.sendStatus(500);
        }
        else res.send(data);
    })
};


exports.updateOne = (req, res) => {
    MasterSheetMarks.update(req.params.id, req.body, (err, data) => {
        if (err) res.sendStatus(500);
        else res.send(data);
    })
}

exports.deleteOne = (req, res) => {
    MasterSheetMarks.delete(req.params.id, (err, data) => {
        if (err) res.sendStatus(500);
        else res.send(data);
    })
}