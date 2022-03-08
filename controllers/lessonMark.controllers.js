
const LessonMark = require('../models/lessonMark.models');

exports.create = (req, res) => {
    if (!req.body) {
        res.status(400).send({
            message: "Body is empty"
        });
    }
    const lessonMark = new LessonMark({
        lessonId: req.body.lessonId,
        markTypeId: req.body.markTypeId,
        maximumDegree: req.body.maximumDegree,
        createdBy: req.body.createdBy,
    });

    LessonMark.create(lessonMark, (err, data) => {
        if (err) res.sendStatus(500);
        else res.send(data);
    })
};

exports.findAll = (req, res) => {
    LessonMark.getAll((err, data) => {
        if (err) res.sendStatus(500);
        else res.send(data);
    });
};

exports.findAllMarkTypes = (req, res) => {
    LessonMark.getAllMarkTypes((err, data) => {
        if (err) res.sendStatus(500);
        else res.send(data);
    });
};

exports.findOne = (req, res) => {
    LessonMark.findById(req.params.id, (err, data) => {
        if (err) {
            if (err.kind == "not_found") res.sendStatus(404);
            else res.sendStatus(500);
        }
        else res.send(data);
    })
};


exports.updateOne = (req, res) => {
    LessonMark.update(req.params.id, req.body, (err, data) => {
        if (err) res.sendStatus(500);
        else res.send(data);
    })
}

exports.deleteOne = (req, res) => {
    LessonMark.delete(req.params.id, (err, data) => {
        if (err) res.sendStatus(500);
        else res.send(data);
    })
}