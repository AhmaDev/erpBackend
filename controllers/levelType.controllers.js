
const LevelType = require('../models/levelType.models');

exports.create = (req, res) => {
    if (!req.body) {
        res.status(400).send({
            message: "Body is empty"
        });
    }
    const levelType = new LevelType({
        level: req.body.level,
        sectionId: req.body.sectionId,
        masterSheetStudyTypeId: req.body.masterSheetStudyTypeId,
        studyYearId: req.body.studyYearId,
        createdBy: req.body.createdBy,
    });

    LevelType.create(levelType, (err, data) => {
        if (err) res.sendStatus(500);
        else res.send(data);
    })
};

exports.findAll = (req, res) => {
    LevelType.getAll(req.query, (err, data) => {
        if (err) res.sendStatus(500);
        else res.send(data);
    });
};

exports.findAllBySectionId = (req, res) => {
    LevelType.getAllBySectionId(req.params.id, req.query, (err, data) => {
        if (err) res.sendStatus(500);
        else res.send(data);
    });
};

exports.findOne = (req, res) => {
    LevelType.findById(req.params.id, (err, data) => {
        if (err) {
            if (err.kind == "not_found") res.sendStatus(404);
            else res.sendStatus(500);
        }
        else res.send(data);
    })
};


exports.updateOne = (req, res) => {
    LevelType.update(req.params.id, req.body, (err, data) => {
        if (err) res.sendStatus(500);
        else res.send(data);
    })
}

exports.deleteOne = (req, res) => {
    LevelType.delete(req.params.id, (err, data) => {
        if (err) res.sendStatus(500);
        else res.send(data);
    })
}