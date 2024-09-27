const jwt = require('jsonwebtoken');

const authMiddleware = (req, res, next) => {
    const authorization = req.headers['authorization'];

    if (!authorization) {
        return res.status(401).json({ error: 'Authorization header missing' });
    }

    const token = authorization.split(' ')[1]; // Extract token from 'Bearer <token>'

    if (!token) {
        return res.status(401).json({ error: 'Token missing' });
    }

    try {
        const decodedToken = jwt.verify(token, process.env.SECRET); // Verify the token
        req.user = decodedToken; // Attach the decoded token (user info) to the request object
        next();
    } catch (error) {
        return res.status(401).json({ error: 'Token invalid' });
    }
};

module.exports = authMiddleware;
