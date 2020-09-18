const petModel = require("../models/pet.model");

module.exports.addPet = (req, result) => {
    console.log("Entering addPet, name="+req.body.name);
    let existingPets = [];
    petModel.Pet.find({ name: req.body.name})
    .then(objs => {
        if (objs.length > 0) {
            console.log("Pet with name already exists!");
            result.status(400).json({ status: "failed"
            , errors: {
                "name" : { message: "Pet with name already exists!" }
            }
            })
            return;           
        }
    })
    .catch(err => {
        console.log("Find failed: "+JSON.stringify(err))
    });

    petModel.Pet.create(req.body)
    .then(obj => result.json(
        { status: "succeeded"
        , message: `addpet succeeded, id=${obj._id}`
        , result: obj}))
    .catch(err => result.status(400).json({ status: "failed", errors: err.errors }));
};

module.exports.findPets = (req, result) => {
    console.log(`findpets: ${JSON.stringify(req.body)}`);
    petModel.Pet.find(req.body)
    .then(objs => result.json(
        { status: "succeeded"
        , message: `findpets succeeded, count=${objs.length}`
        , result: objs}))
    .catch(err => result.status(400).json({ status: "failed", errors: err.errors }));
};

module.exports.deletePet = (req, result) => {
    petModel.Pet.deleteOne({ _id: req.params.id })
    .then(obj => result.json(
        { status: "succeeded"
        , message: `deletepet succeeded, id=${req.params.id}`
        , result: obj}))
    .catch(err => result.status(400).json({ status: "failed", errors: err.errors }));
};
module.exports.getPetById = (req, result) => {
    console.log(`getPetById: ${req.params.id}`);
    petModel.Pet.findOne({ _id: req.params.id })
    .then(obj => result.json(
        { status: "succeeded"
        , message: `getPetById succeeded, id=${obj._id}`
        , result: obj}))
        .catch(err => result.status(400).json({ status: "failed", errors: err.errors }));
};
module.exports.getAllPets = (req, result) => {
    console.log(`getAllPets: ${JSON.stringify(req.body)}`);
    petModel.Pet.find().sort('type')
    .then(objs => result.json(
        { status: "succeeded"
        , message: `getAllpets succeeded, count=${objs.length}`
        , result: objs}))
    .catch(err => result.status(400).json({ status: "failed", errors: err.errors }));
};

module.exports.updatePet = (req, result) => {
    console.log("updatepet:", JSON.stringify(req.body));
    petModel.Pet.findOneAndUpdate({ _id: req.params.id }, req.body, { runValidators: true, useFindAndModify: false })
    .then(obj => result.json(
        { status: "succeeded"
        , message: `updatepet succeeded, id=${obj._id}`
        , result: obj}))
    .catch(err => result.status(400).json({ status: "failed", errors: err.errors }));
};