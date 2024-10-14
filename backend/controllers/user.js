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
usersRouter.get('/patients', async (req, res) => {
    try {
        // 检查当前用户是否是医生
        if (req.user.role !== 'doctor') {
            return res.status(403).json({ error: 'Access denied. Only doctors can view this.' });
        }

        // 找到该医生的患者（假设你有一种机制来关联医生和患者）
        const patients = await User.find({ assignedDoctor: req.user._id, role: 'patient' });
        res.json(patients);
    } catch (error) {
        console.error('Error fetching patients:', error);
        res.status(500).json({ error: 'Server error' });
    }
});
module.exports = usersRouter;
