//Requete pour connexion à la DB
const mysql = require('mysql');

const db = mysql.createConnection({
    host: "bsf4pyjrvqgcp9qzmyvc-mysql.services.clever-cloud.com",
    user: "u2isg0mgvwkq91zv",
    password: "2eWTYTATsCpLkWc1jYtc",
    database : "bsf4pyjrvqgcp9qzmyvc"
});

db.connect(function(err) { 
    if (err) throw err;
    console.log('Connecté!')
});

module.exports = db;
