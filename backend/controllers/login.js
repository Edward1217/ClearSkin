const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const loginRouter = require("express").Router();
const User = require("../models/user");
const logger = require("../utils/logger");

loginRouter.post("/", async (request, response) => {
    const { email, password } = request.body; // Change username to email

    // Try to find the user in the database by the email
    const user = await User.findOne({ username: email }); // Use email instead of username

    const passwordCorrect = user === null
        ? false
        : await bcrypt.compare(password, user.passwordHash);

    if (!(user && passwordCorrect)) {
        logger.error(`Invalid login attempt for user: ${email}`); // Log the email instead of username
        return response.status(401).json({
            error: "invalid email or password"
        });
    }

    const userForToken = {
        username: user.username,
        id: user._id,
        role: user.role,
    };

    const token = jwt.sign(
        userForToken,
        process.env.SECRET,
        { expiresIn: 60 * 60 }
    );
    console.log('Login response:', { token, username: user.username, name: user.name, role: user.role });
    response
        .status(200)
        .send({ token, username: user.username, name: user.name,role: user.role});
});

module.exports = loginRouter;


