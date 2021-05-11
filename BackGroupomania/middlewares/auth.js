const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
    try {
        const token = req.headers.authorization.split(' ')[1];
        const decodedToken = jwt.verify(token, process.env.RANDOM_TOKEN);
        const userId = decodedToken.userId;

        /*
        Get cookie : req.cookies[CookieName]
        */

        if (req.body.userId && req.body.userId !== userId) {
            throw 'Invalid token';
        } else {
            next();
        }
    } catch {
        res.status(401).json({
            error: new Error('Invalid request!')
        });
    }
}; 