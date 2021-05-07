const mysql = require('mysql');
const dbConnect = require('../config/dbConnect');

// Fonction pour récupération de tout les posts
exports.getAllPosts = (req, res, next) => {
    //Requete MySql pour créer une jointure entre les champs de la table posts et les champs de la table users
    const sql = "SELECT posts.id, user_id, image_url, content, DATE_FORMAT(DATE(posts.updated_at), '%d/%m/%Y') AS date, TIME(posts.updated_at) AS time, name, firstname FROM posts INNER JOIN users ON posts.user_id = users.id "
    dbConnect.query(sql, (err, result) => {
        if (err) {
            res.status(400).json({ error: err });
        };
        res.status(201).json(result);
    })
};

exports.createPost = (req, res, next) => {
    const { userId, content } = req.body;
    const imageUrl = `${req.protocol}://${req.get('host')}/images/${req.file.filename}`;

    //requete MySql pour venir insérer un nouveau post à la table "posts"
    let sql = "INSERT INTO `posts` (user_id, image_url, content) VALUES (?, ?, ?)";
    sql = mysql.format(sql, [userId, imageUrl, content]);

    dbConnect.query(sql, (err, result) => {
        if (err) {
            res.status(400).json({ error: err });
        };
        res.status(201).json({ message: 'Post créé avec succès'});
    })
};
