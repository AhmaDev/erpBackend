const MasterSheet = require('../models/masterSheet.models');

exports.create = (req, res) => {
    if (!req.body) {
        res.status(400).send({
            message: "Body is empty"
        });
    }
    const masterSheet = new MasterSheet({
        sectionId: req.body.sectionId,
        studyLevel: req.body.studyLevel,
        studyClass: req.body.studyClass,
        studyYearId: req.body.studyYearId,
        studyType: req.body.studyType,
        masterSheetTypeId: req.body.masterSheetTypeId,
        masterSheetStudyTypeId: req.body.masterSheetStudyTypeId,
        materSheetNotice: req.body.materSheetNotice,
        createdBy: req.body.createdBy,
    });

    MasterSheet.create(masterSheet, (err, data) => {
        if (err) res.sendStatus(500);
        else res.send(data);
    })
};

exports.findAll = (req, res) => {
    MasterSheet.getAll(req.query, (err, data) => {
        if (err) res.sendStatus(500);
        else res.send(data);
    });
};

exports.findAllMasterSheetTypes = (req, res) => {
    MasterSheet.getAllMasterSheetTypes( (err, data) => {
        if (err) res.sendStatus(500);
        else res.send(data);
    });
};

exports.findOne = (req, res) => {
    MasterSheet.findById(req.params.id, (err, data) => {
        if (err) {
            if (err.kind == "not_found") res.sendStatus(404);
            else res.sendStatus(500);
        }
        else res.send(data);
    })
};

exports.findBySectionId = (req, res) => {
    MasterSheet.findBySectionId(req.params.id, (err, data) => {
        if (err) {
            if (err.kind == "not_found") res.sendStatus(404);
            else res.sendStatus(500);
        }
        else res.send(data);
    })
};


exports.updateOne = (req, res) => {
    MasterSheet.update(req.params.id, req.body, (err, data) => {
        if (err) res.sendStatus(500);
        else res.send(data);
    })
}

exports.deleteOne = (req, res) => {
    MasterSheet.delete(req.params.id, (err, data) => {
        if (err) res.sendStatus(500);
        else res.send(data);
    })
}