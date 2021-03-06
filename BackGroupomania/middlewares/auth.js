module.exports = (req, res, next) => {
    try {
        next();

        /*
        * - Récupérer userId (représente l'id de l'utilisateur) depuis req.body.
        * - Récupérer et décoder cookie pour récupéré l'id (utilisateur actuellement connecté).
        * - Comparer userId avec id, si les deux concorde alors on "next()"
        */

        /*
        const token = req.headers.authorization.split(' ')[1];
        const decodedToken = jwt.verify(token, process.env.RANDOM_TOKEN);
        const userId = decodedToken.userId;

        if (req.body.userId && req.body.userId !== userId) {
            throw 'Invalid token';
        } else {
            next();
        }
        */
    } catch {
        res.status(401).json({
            error: new Error('Invalid request!')
        });
    }
};