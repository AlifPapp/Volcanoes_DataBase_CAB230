const jwt = require('jsonwebtoken');

const authenticate = (req, res, next) => {
    const authHeader = req.headers.authorization;

    if (authHeader) {
        const token = authHeader.split(' ')[1];

        if (!token) {
            return res.status(401).json({
                error: true,
                message: 'Authorization header is malformed'
            });
        }

        jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
            if (err) {
                if (err.name === 'TokenExpiredError') {
                    return res.status(401).json({
                        error: true,
                        message: 'JWT token has expired'
                    });
                } else {
                    return res.status(401).json({
                        error: true,
                        message: 'Invalid JWT token'
                    });
                }
            }

            req.user = user;
            next();
        });
    }
    else {
        req.user = null;
        next();
    }
};

module.exports = authenticate;