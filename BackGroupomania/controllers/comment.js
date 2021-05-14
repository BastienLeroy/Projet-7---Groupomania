const mysql = require('mysql');
const dbConnect = require('../config/dbConnect');

exports.getAllComments = (req, res, next) => {
    const { id } = req.query;
    
    let sql = "SELECT comments.id, post_id, user_id, content, DATE_FORMAT(DATE(comments.updated_at), '%d/%m/%Y') AS date, TIME(comments.updated_at) AS time, name, firstname FROM comments INNER JOIN users ON comments.user_id = users.id WHERE comments.post_id = ?"
    sql = mysql.format(sql, [id]);

    dbConnect.query(sql, (err, result) => {
        if (err) {
            res.status(400).json({ error: err });
        } else {
            res.status(200).json(result);
        }
    })
};

exports.createComment = (req, res, next) => {
    const { postId, userId, content } = req.body;
   
    let sql = "INSERT INTO `comments` (post_id, user_id, content ) VALUES (?, ?, ?)";
    sql = mysql.format(sql, [postId, userId, content]);
    dbConnect.query(sql, (err, result) => {
        if (err) {
            res.status(400).json({ error: err });
        } else {
            res.status(201).json({ message: 'Commentaire créé avec succès'});
        }
    })
};

exports.modifyComment = (req, res, next) => {
    const { id, content } = req.body;
    const date = new Date().toISOString().slice(0, 19).replace('T', ' ');

    let sql = "UPDATE comments SET content = ?, updated_at = ? WHERE id = ?";
    sql = mysql.format(sql, [content, date, id])

    dbConnect.query(sql, (err, result) => {
        if (err) {
            res.status(400).json({ error: err });
        } else {
            res.status(201).json({ message: 'Commentaire modifié avec succès'});
        }
    })
};

exports.deleteComment = (req, res, next) => {
    const { id } = req.body;
    
    let sql = "DELETE FROM `comments` WHERE id = 3";
    sql = mysql.format(sql, [id])

    dbConnect.query(sql, (err, result) => {
        if (err) {
            res.status(400).json({ error: err });
        } else {
            res.status(201).json({ message: 'Commentaire supprimé avec succès'});
        }
    })
};