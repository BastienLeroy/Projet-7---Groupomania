const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const mysql = require('mysql');
const dbConnect = require('../config/dbConnect');

exports.signup = async (req, res, next) => {
    try {
        const { name, firstname, email, password } = req.body;
        const passwordHash = await bcrypt.hash(password, 10);

        let sql = "INSERT INTO `users` (name, firstname, email, password) VALUES (?, ?, ?, ?)";
        sql = mysql.format(sql, [name, firstname, email, passwordHash]);
        
        dbConnect.query(sql, (err, result) => {
            if (err) {
                res.status(400).json({ error: err });
            };
            res.status(201).json({ message: 'Utilisateur créé avec succès'});
        })
    } catch(err) {
        res.status(400).json({ error: err })
    }
};

exports.signin = (req, res, next) => {
    const { email, password } = req.body
    let sql = 'SELECT * FROM users WHERE email = ?';
    sql = mysql.format(sql, [email]);

    dbConnect.query(sql, async (err, result) => {
        if (err || !result[0]) {
            res.status(400).json({ error: 'Utilisateur introuvable !' });
        } else {
            try {
                const response = await bcrypt.compare(password, result[0].password);
                if (!response) {
                    res.status(400).json({ error: 'Email ou mot de passe incorrect !' })
                }
                res.status(201).json({
                    userId: result[0].id,
                    token: jwt.sign(
                        {
                            userId: result[0].id,
                            isModerator: result[0].isMod
                        },
                        process.env.RANDOM_TOKEN,
                        { expiresIn: '24h' } 
                    ),
                    isModerator: result[0].isMod
                });
            } catch(err) {
                res.status(400).json({ error: err })
            }
        }
    })
};