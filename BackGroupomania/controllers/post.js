const mysql = require('mysql');
const dbConnect = require('../config/dbConnect');
const jwt = require('jsonwebtoken');
const fs = require('fs');

// Fonction pour récupération de tout les posts
exports.getAllPosts = (req, res, next) => {
    //Requete MySql pour créer une jointure entre les champs de la table posts et les champs de la table users
    const sql = "SELECT posts.id, user_id, posts.image_url, content, DATE_FORMAT(DATE(posts.updated_at), '%d/%m/%Y') AS date, TIME(posts.updated_at) AS time, name, firstname FROM posts INNER JOIN users ON posts.user_id = users.id ORDER BY posts.updated_at DESC"
    dbConnect.query(sql, (err, result) => {
        if (err) {
            res.status(400).json({ error: err });
        } else {
            res.status(201).json(result);
        }
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

exports.modifyPost = (req, res, next) => {
    const { id, content } = req.body;
    const imageUrl = typeof req.file !== 'undefined' ? `${req.protocol}://${req.get('host')}/images/${req.file.filename}` : req.body.imageUrl;
    const date  = new Date().toISOString().slice(0, 19).replace('T', ' ');
    
    let sql = "UPDATE posts SET image_url = ?, content = ?, updated_at = ? WHERE id = ?"
    sql = mysql.format(sql, [imageUrl, content, date, id]);

    dbConnect.query(sql, (err, result) => {
        if (err) {
            res.status(400).json({ error: err });
        } else {
            res.status(201).json({ message: 'Post modifié avec succès'});
        }
    })
};

exports.deletePost = (req, res, next) => {
    const { id } = req.body;

    let sqlgetInfoPost = 'SELECT image_url FROM `posts` WHERE id = ?';
    sqlgetInfoPost = mysql.format(sqlgetInfoPost, [id]);

    dbConnect.query(sqlgetInfoPost, (err, post) => {
        if (err) {
            res.status(400).json({ error: err });
        } else {
            const postImageName = post[0].image_url.split('/images/')[1];

            fs.unlink(`images/${postImageName}`, () => {
                let sql = "DELETE FROM `posts` WHERE id = ?"
                sql = mysql.format(sql, [ id ]);
                dbConnect.query(sql, (err, result) => {
                    if (err) {
                        res.status(400).json({ error: err });
                    } else {
                        res.status(201).json({ message: 'Post supprimé avec succès'});
                    }
                })
            })
        }
    })
};