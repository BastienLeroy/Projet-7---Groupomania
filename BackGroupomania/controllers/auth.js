const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const mysql = require('mysql');
const dbConnect = require('../config/dbConnect');

//fonction de création d'un nouvel utilsateur
exports.signup = async (req, res, next) => {
    try {
        const { email, password } = req.body;// Déclaration des constantes = contenu du body
        const passwordHash = await bcrypt.hash(password, 10);

        let sql = "INSERT INTO `users` (email, password) VALUES (?, ?)";//Requete MySql pour insérer un nouvel utilisateur dans la table "users"
        sql = mysql.format(sql, [email, passwordHash]);
        
        dbConnect.query(sql, (err, result) => {
            if (err) {
                res.status(400).json({ error: err });
            } else {
                res.status(201).json({ message: 'Utilisateur créé avec succès'});
            }
        })
    } catch(err) {
        res.status(400).json({ error: err })
    }
};

//Fonction pour la connexion d'un utilisateur existant 
exports.signin = (req, res, next) => {
    const { email, password } = req.body// Déclaration des constantes = contenu du body (email et password)
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
                } else {
                    const { id, image_url, name, firstname, email, isMod } = result[0];

                    const token = jwt.sign(
                        {
                            id,
                            isMod
                        },
                        process.env.RANDOM_TOKEN,
                        { expiresIn: '24h' }
                    );

                    res.cookie('access_token', token, {
                        maxAge: 86400000,
                        httpOnly: true,
                    });
                    res.status(200).json({
                        id,
                        image_url,
                        name,
                        firstname,
                        email,
                        isMod
                    });
                    res.send();
                }
            } catch(err) {
                res.status(400).json({ error: err })
            }
        }
    })
};

exports.checklogged = (req, res, next) => {
    const cookie = req.cookies['access_token'];
    
    if (typeof cookie === 'undefined') {
        res.status(200).json({ error: "pas de cookie" });
    } else {
        const decodedToken = jwt.verify(cookie, process.env.RANDOM_TOKEN);

        let sql = 'SELECT * FROM users WHERE id = ?';
        sql = mysql.format(sql, [decodedToken.id]);

        dbConnect.query(sql, (err, result) => {
            if (err) {
                res.status(200).json({ error: 'Utilisateur introuvable' });
            } else {
                const { id, image_url, name, firstname, email, isMod } = result[0];
    
                res.status(200).json({
                    id,
                    image_url,
                    name,
                    firstname,
                    email,
                    isMod
                });
            }
        })
    }
};

exports.disconnect = (req, res, next) => {
    res.clearCookie('access_token').send();
};