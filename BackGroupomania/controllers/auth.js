const Auth = require('../models/Auth');

const User = new Auth();

exports.signup = (req, res, next) => {
    User.signup(['a', 'b', 'c', 'd'])
    .then(response => {
        res.status(201).json(response);
    })
    .catch(err => {
        console.log("error :", err);
        res.status(400).json({ error: err })
    })
};