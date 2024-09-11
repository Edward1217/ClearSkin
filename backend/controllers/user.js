const bcrypt = require("bcrypt");
const usersRouter = require("express").Router();
const User = require("../models/user");

usersRouter.post("/", async (request, response) => {
    try {
        const { username, name, password } = request.body;

        // Check if username (email) is valid and password meets the complexity
        if (!username || !/^\S+@\S+\.\S+$/.test(username)) {
            return response.status(400).json({ error: "A valid email address is required" });
        }
        if (!password || password.length < 3) {
            return response.status(400).json({ error: "Password must be at least 3 characters long" });
        }

        // Check if user exists
        const existingUser = await User.findOne({ username });
        if (existingUser) {
            return response.status(400).json({ error: "Email already in use" });
        }

        // Hash password and save user
        const saltRounds = 10;
        const passwordHash = await bcrypt.hash(password, saltRounds);
        const user = new User({ username, name, passwordHash });
        const savedUser = await user.save();

        response.status(201).json(savedUser);
    } catch (error) {
        response.status(500).json({ error: "something went wrong" });
    }
});

module.exports = usersRouter;