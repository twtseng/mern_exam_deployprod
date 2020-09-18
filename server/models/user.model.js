const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
    name: {
        type: String,
        minlength: [3, "name must be at least 2 chars"],
        required: [true, "name field is required"]
    },
    email: {
        type: String,
        minlength: [5, "email must be at least 5 chars"],
        required: [true, "email field is required"]
    },
    oauth_source: {
        type: String,
        required: [true, "oauth_source field is required"]
    },
    oauth_id: {
        type: String,
        required: [true, "oauth_id field is required"]
    }
});
UserSchema.methods.getDisplayName = function() {
    if (this.name === "UNINITIALIZED") {
        return `unregistered ${this.oauth_source} user`;
    } else {
        return `${this.name} (${this.oauth_source})`;
    }
}
exports.User = mongoose.model("User", UserSchema);