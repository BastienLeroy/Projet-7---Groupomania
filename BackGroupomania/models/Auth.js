const dbConnect = require('../config/dbConnect');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const mysql = require('mysql');

class Auth {
    constructor() {};

    signup(dataSignup) {
        let sql = "INSERT INTO `users` (name, firstname, email, password) VALUES (?, ?, ?, ?)";
        sql = mysql.format(sql, dataSignup);
        return new Promise((resolve, reject) => {
            dbConnect.query(sql, (err, result) => {
                if (err) reject({error : err});
                resolve({message : 'Nouvel utilisateur créé !'})
            })
        })
    }
    signin(dataSignin) {
        const { email, password } = dataSignin
        let sql = 'SELECT * FROM users WHERE email = ?';
        sql = mysql.format(sql, [email]);

        return new Promise((resolve, reject) => {
            dbConnect.query(sql, (err, result) => {
                if (err) reject({ err });
                if (!result[0]) {
                    reject ({ error : 'Utilisateur introuvable !'})
                } else {
                    bcrypt.compare(password, result[0].password)
                        .then(valid =>  {
                            if (!valid) return reject({ error: 'Email ou mot de passe incorrect !' });
                            resolve({
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
                        })
                        .catch(error => reject({ error }));
                    
                }
            })
        })
    }
};
module.exports = Auth;