const bcrypt = require("bcrypt");
const usersRouter = require("express").Router();
const User = require("../models/user");

usersRouter.get("/", async (request, response) => {
    const users = await User
        .find({})
    //  .populate("shows",{ url:1,title:1,genre:1,id:1 });
    response.json(users);
});

usersRouter.post("/", async (request, response) => {
    const { username, name, password } = request.body;

    // Check if username (email) is provided and is in valid email format
    if (!username || !/^\S+@\S+\.\S+$/.test(username)) {
        return response.status(400).json({ error: "A valid email address is required" });
    }

    if (!password || password.length < 3) {
        return response.status(400).json({ error: "Password must be at least 3 characters long" });
    }

    const existingUser = await User.findOne({ username });
    if (existingUser) {
        return response.status(400).json({ error: "Email already in use" });
    }

    const saltRounds = 10;
    const passwordHash = await bcrypt.hash(password, saltRounds);

    const user = new User({
        username,
        name,
        passwordHash,
    });

    const savedUser = await user.save();

    response.status(201).json(savedUser);
});

module.exports = usersRouter;
