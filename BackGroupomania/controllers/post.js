const mysql = require('mysql');
const dbConnect = require('../config/dbConnect');

exports.getAllPosts = (req, res, next) => {
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

    let sql = "INSERT INTO `posts` (user_id, image_url, content) VALUES (?, ?, ?)";
    sql = mysql.format(sql, [userId, imageUrl, content]);

    dbConnect.query(sql, (err, result) => {
        if (err) {
            res.status(400).json({ error: err });
        };
        res.status(201).json({ message: 'Post créé avec succès'});
    })
};