const bcrypt = require("bcrypt");
const usersRouter = require("express").Router();
const User = require("../models/user");

usersRouter.post("/", async (request, response) => {
    const { username, name, password, role } = request.body;

    // Check if username (email) is valid and role is provided
    if (!username || !/^\S+@\S+\.\S+$/.test(username)) {
        return response.status(400).json({ error: "A valid email address is required" });
    }
    if (!password || password.length < 3) {
        return response.status(400).json({ error: "Password must be at least 3 characters long" });
    }
    if (!role || !['doctor', 'patient'].includes(role)) {
        return response.status(400).json({ error: "A valid role is required" });
    }

    // Check if the user already exists
    const existingUser = await User.findOne({ username });
    if (existingUser) {
        return response.status(400).json({ error: "Email already in use" });
    }

    // Hash the password
    const saltRounds = 10;
    const passwordHash = await bcrypt.hash(password, saltRounds);

    // Create the user with the role
    const user = new User({
        username,
        name,
        passwordHash,
        role, // Save the role
    });

    const savedUser = await user.save();
    response.status(201).json(savedUser);
});

module.exports = usersRouter;
