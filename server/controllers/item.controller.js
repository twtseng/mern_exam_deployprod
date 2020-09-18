const itemModel = require("../models/item.model");

module.exports.addItem = (req, result) => {
    itemModel.Item.create(req.body)
    .then(obj => result.json(
        { status: "succeeded"
        , message: `additem succeeded, id=${obj._id}`
        , result: obj}))
    .catch(err => result.status(400).json({ status: "failed", errors: err.errors }));
};

module.exports.findItems = (req, result) => {
    console.log(`finditems: ${JSON.stringify(req.body)}`);
    itemModel.Item.find(req.body)
    .then(objs => result.json(
        { status: "succeeded"
        , message: `finditems succeeded, count=${objs.length}`
        , result: objs}))
    .catch(err => result.status(400).json({ status: "failed", errors: err.errors }));
};

module.exports.deleteItem = (req, result) => {
    itemModel.Item.deleteOne({ _id: req.params.id })
    .then(obj => result.json(
        { status: "succeeded"
        , message: `deleteitem succeeded, id=${req.params.id}`
        , result: obj}))
    .catch(err => result.status(400).json({ status: "failed", errors: err.errors }));
};

module.exports.getAllItems = (req, result) => {
    itemModel.Item.find()
    .then(objs => result.json(
        { status: "succeeded"
        , message: `getAllitems succeeded, count=${objs.length}`
        , result: objs}))
    .catch(err => result.status(400).json({ status: "failed", errors: err.errors }));
};

module.exports.updateItem = (req, result) => {
    console.log("updateitem:", JSON.stringify(req.body));
    itemModel.Item.findOneAndUpdate({ _id: req.params.id }, req.body, { runValidators: true, useFindAndModify: false })
    .then(obj => result.json(
        { status: "succeeded"
        , message: `updateitem succeeded, id=${obj._id}`
        , result: obj}))
    .catch(err => result.status(400).json({ status: "failed", errors: err.errors }));
};

module.exports.addSubItem = async (req, result) => {
    console.log(`addSubItem: ${req.params.id}, ${JSON.stringify(req.body)}`);
    try {
        let item = await itemModel.Item.findById({ _id: req.params.id });
        await item.subItems.push(req.body);
        await item.save();
        result.json(
            { status: "succeeded"
            , message: `addSubItem succeeded`
            , result: []
        });
    } catch(err) {
        result.status(400).json({ status: "failed", errors: err.errors })
    }
};