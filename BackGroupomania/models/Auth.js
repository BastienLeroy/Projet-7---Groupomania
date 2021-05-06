const dbConnect = require('../config/dbConnect');
const mysql = require('mysql');

class Auth {
    constructor() {};

    signup(dataSignup) {
        let sql = "INSERT INTO `users` (nom, firstname, email, password) VALUES (?, ?, ?, ?)";
        sql = mysql.format(sql, dataSignup);
        return new Promise((resolve, reject) => {
            dbConnect.query(sql, (err, result) => {
                if (err) reject({error : err});
                resolve({message : 'Nouvel utilisateur créé !'})
            })
        })
    }
};
module.exports = Auth;