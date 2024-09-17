const mongoose = require("mongoose");
const uniqueValidator = require("mongoose-unique-validator");

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true,
        minLength: 3,
        match: [/^\S+@\S+\.\S+$/, 'Please enter a valid email address'],
    },
    name: String,
    passwordHash: String,
    role: {
        type: String,
        enum: ['doctor', 'patient'], // Only allow 'doctor' or 'patient'
        required: true,
    },
});

userSchema.plugin(uniqueValidator);

userSchema.set("toJSON", {
    transform: (document, returnedObject) => {
        returnedObject.id = returnedObject._id.toString();
        delete returnedObject._id;
        delete returnedObject.__v;
        delete returnedObject.passwordHash; // Hide password hash
    }
});

const User = mongoose.model("User", userSchema);

module.exports = User;
