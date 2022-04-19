const User = require('../models/user.models');
const jwt = require("jsonwebtoken");
require('dotenv').config()

exports.login = (req, res) => {
    if (!req.body) {
        res.status(400).send({
            message: "Body is empty"
        });
    }
    User.login(req.body, (err, data) => {
        if (err) {
            if (err.kind == "not_found") res.sendStatus(404);
            else res.sendStatus(500);
        }

        else {
            const token = jwt.sign(JSON.parse(JSON.stringify(data)), process.env.SECRET_KEY, {
                expiresIn: "30d",
            });
            res.send({token});
        };
    });
};

exports.create = (req, res) => {
    if (!req.body) {
        res.status(400).send({
            message: "Body is empty"
        });
    }
    const user = new User({
        userName: req.body.userName,
        password: req.body.password,
        roleId: req.body.roleId,
        sectionId: req.body.sectionId,
    });

    User.create(user, (err, data) => {
        if (err) res.sendStatus(500);
        else res.send(data);
    })
};

exports.findAll = (req, res) => {
    User.getAll((err, data) => {
        if (err) res.sendStatus(500);
        else res.send(data);
    });
};

exports.findOne = (req, res) => {
    User.findById(req.params.id, (err, data) => {
        if (err) {
            if (err.kind == "not_found") res.sendStatus(404);
            else res.sendStatus(500);
        }
        else res.send(data);
    })
};

exports.findSettings = (req, res) => {
    User.getSettings(req.query.variable, (err, data) => {
        if (err) {
            if (err.kind == "not_found") res.sendStatus(404);
            else res.sendStatus(500);
        }
        else res.send(data);
    })
};


exports.updateOne = (req, res) => {
    User.update(req.params.id, req.body, (err, data) => {
        if (err) res.sendStatus(500);
        else res.send(data);
    })
}

exports.deleteOne = (req, res) => {
    User.delete(req.params.id, (err, data) => {
        if (err) res.sendStatus(500);
        else res.send(data);
    })
}