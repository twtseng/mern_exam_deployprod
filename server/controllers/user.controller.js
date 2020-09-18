const userModel = require("../models/user.model");

module.exports.addUser = (req, result) => {
    userModel.User.create(req.body)
    .then(obj => result.json(
        { status: "succeeded"
        , message: `addUser succeeded, displayName=${obj.getDisplayName()}`
        , result: obj}))
    .catch(err => result.status(400).json({ status: "failed", errors: err.errors }));
};

module.exports.findUsers = (req, result) => {
    console.log(`findUsers: ${JSON.stringify(req.body)}`);
    userModel.User.find(req.body)
    .then(objs => result.json(
        { status: "succeeded"
        , message: `findUsers succeeded, count=${objs.length}`
        , result: objs}))
    .catch(err => result.status(400).json({ status: "failed", errors: err.errors }));
};

module.exports.deleteUser = (req, result) => {
    userModel.User.deleteOne({ _id: req.params.id })
    .then(obj => result.json(
        { status: "succeeded"
        , message: `deleteUser succeeded, id=${req.params.id}`
        , result: obj}))
    .catch(err => result.status(400).json({ status: "failed", errors: err.errors }));
};

module.exports.getAllUsers = (req, result) => {
    userModel.User.find()
    .then(objs => result.json(
        { status: "succeeded"
        , message: `getAllUsers succeeded, count=${objs.length}`
        , result: objs}))
    .catch(err => result.status(400).json({ status: "failed", errors: err.errors }));
};

module.exports.updateUser = (req, result) => {
    console.log("updateUser:", JSON.stringify(req.body));
    userModel.User.findOneAndUpdate({ _id: req.params.id }, req.body, { runValidators: true, useFindAndModify: false })
    .then(obj => result.json(
        { status: "succeeded"
        , message: `updateUser succeeded, id=${obj._id}`
        , result: obj}))
    .catch(err => result.status(400).json({ status: "failed", errors: err.errors }));
};