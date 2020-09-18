const mongoose = require("mongoose");

const PetSchema = new mongoose.Schema({
    name: {
        type: String,
        minlength: [3, "name must be at least 3 chars"],
        required: [true, "name field is required"],
        index: { unique: true }
    },
    type: {
        type: String,
        minlength: [3, "type must be at least 3 chars"],
        required: [true, "type field is required"]
    },
    description: {
        type: String,
        minlength: [3, "description must be at least 3 chars"],
        required: [true, "description field is required"]
    },  
    skill1: {
        type: String
    },  
    skill2: {
        type: String
    }, 
    skill3: {
        type: String
    }, 
    likes: {
        type: Number,
        default: 0
    }, 
})

exports.Pet = mongoose.model("Pet", PetSchema);