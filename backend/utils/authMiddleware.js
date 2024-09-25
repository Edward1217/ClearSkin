const jwt = require('jsonwebtoken');
const User = require('../models/user');

const authMiddleware = async (req, res, next) => { // Mark as async
    const authorization = req.get('Authorization');
    if (authorization && authorization.toLowerCase().startsWith('bearer ')) {
        try {
            const token = authorization.substring(7);
            const decodedToken = jwt.verify(token, process.env.SECRET);

            if (!decodedToken.id) {
                return res.status(401).json({ error: 'Token invalid or missing' });
            }

            req.user = await User.findById(decodedToken.id); // Attach user to request
            next();
        } catch (error) {
            return res.status(401).json({ error: 'Token invalid or expired' });
        }
    } else {
        return res.status(401).json({ error: 'Token missing' });
    }
};

module.exports = authMiddleware;
