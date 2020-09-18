const mongoose = require("mongoose");

const SubItemSchema = new mongoose.Schema({
    strVal1: {
        type: String,
        minlength: [5, "strVal1 must be at least 5 chars"],
        required: [true, "strVal1 field is required"]
    },
    strVal2: {
        type: String,
        minlength: [8, "strVal2 must be at least 8 chars"],
        required: [true, "strVal2 field is required"]
    },        
});

const ItemSchema = new mongoose.Schema({
    name: {
        type: String,
        minlength: [3, "name must be at least 2 chars"],
        required: [true, "name field is required"]
    },
    strVal1: {
        type: String,
        minlength: [5, "strVal1 must be at least 5 chars"],
        required: [true, "strVal1 field is required"]
    },
    strVal2: {
        type: String,
        minlength: [3, "strVal2 must be at least 8 chars"],
        required: [true, "strVal2 field is required"]
    },
    subItems: [SubItemSchema]    
})

exports.Item = mongoose.model("Item", ItemSchema);