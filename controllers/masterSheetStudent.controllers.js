
const MasterSheetStudent = require('../models/masterSheetStudent.models');

exports.create = (req, res) => {
    if (!req.body) {
        res.status(400).send({
            message: "Body is empty"
        });
    }

    MasterSheetStudent.create(req.body, (err, data) => {
        if (err) res.sendStatus(500);
        else res.send(data);
    })
};

exports.findAll = (req, res) => {
    MasterSheetStudent.getAll((err, data) => {
        if (err) res.sendStatus(500);
        else res.send(data);
    });
};

exports.findOne = (req, res) => {
    MasterSheetStudent.findById(req.params.id, (err, data) => {
        if (err) {
            if (err.kind == "not_found") res.sendStatus(404);
            else res.sendStatus(500);
        }
        else res.send(data);
    })
};


exports.updateOne = (req, res) => {
    MasterSheetStudent.update(req.params.id, req.body, (err, data) => {
        if (err) res.sendStatus(500);
        else res.send(data);
    })
}

exports.deleteOne = (req, res) => {
    MasterSheetStudent.delete(req.params.id, (err, data) => {
        if (err) res.sendStatus(500);
        else res.send(data);
    })
}