const Student = require('../models/student.models');

exports.findAll = (req, res) => {
    Student.getAll(req.query,(err, data) => {
        if (err) res.sendStatus(500);
        else res.send(data);
    });
};

exports.findOne = (req, res) => {
    Student.findById(req.params.id, (err, data) => {
        if (err) {
            if (err.kind == "not_found") res.sendStatus(404);
            else res.sendStatus(500);
        }
        else res.send(data);
    })
};

exports.updateOne = (req, res) => {
    Student.update(req.params.id, req.body, (err, data) => {
        if (err) res.sendStatus(500);
        else res.send(data);
    })
}

exports.updateClass = (req, res) => {
    Student.updateClass(req.params.id, req.body, (err, data) => {
        if (err) res.sendStatus(500);
        else res.send(data);
    })
}

exports.deleteOne = (req, res) => {
    Student.delete(req.params.id, (err, data) => {
        if (err) res.sendStatus(500);
        else res.send(data);
    })
}