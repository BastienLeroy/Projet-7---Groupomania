const mysql = require('mysql');
const dbConnect = require('../config/dbConnect');
const jwt = require('jsonwebtoken');
const fs = require('fs');

// Fonction pour récupération de tout les posts
exports.getAllPosts = (req, res, next) => {
    //Requete MySql pour créer une jointure entre les champs de la table posts et les champs de la table users
    const offset = parseInt(req.query.offset);

    let sql = "SELECT posts.id, user_id, posts.image_url, content, DATE_FORMAT(DATE(posts.updated_at), '%d/%m/%Y') AS date, TIME(posts.updated_at) AS time, name, firstname, users.image_url AS userImage FROM posts INNER JOIN users ON posts.user_id = users.id ORDER BY posts.updated_at DESC LIMIT 10 OFFSET ?"
    sql = mysql.format(sql, [offset]);

    dbConnect.query(sql, (err, result) => {
        if (err) {
            res.status(400).json({ error: err });
        } else {
            res.status(201).json(result);
        }
    })
};

exports.createPost = (req, res, next) => {
    const bodyParsed = JSON.parse(req.body.dataInput);
    const { userId, content } = bodyParsed;

    const imageUrl = `${req.protocol}://${req.get('host')}/images/posts/${req.file.filename}`;

    //requete MySql pour venir insérer un nouveau post à la table "posts"
    let sql = "INSERT INTO `posts` (user_id, image_url, content) VALUES (?, ?, ?)";
    sql = mysql.format(sql, [userId, imageUrl, content]);

    dbConnect.query(sql, (err, result) => {
        if (err) {
            res.status(400).json({ error: err });
        } else {
            res.status(201).json({ message: 'Post créé avec succès'}); 
        }
    })
};

exports.modifyPost = (req, res, next) => {
    const bodyParsed = JSON.parse(req.body.dataInput);

    const { id, content } = bodyParsed;
    const date  = new Date().toISOString().slice(0, 19).replace('T', ' ');

    if (typeof req.file === 'undefined') {
        const imageUrl = bodyParsed.imageUrl;

        let sql = "UPDATE posts SET image_url = ?, content = ?, updated_at = ? WHERE id = ?"
        sql = mysql.format(sql, [imageUrl, content, date, id]);

        dbConnect.query(sql, (err, result) => {
            if (err) {
                res.status(400).json({ error: err });
            } else {
                res.status(200).json({ message: 'Post modifié avec succès'});
            }
        })
    } else {
        const oldImageUrl = bodyParsed.imageUrl;
        const newImageUrl = `${req.protocol}://${req.get('host')}/images/posts/${req.file.filename}`;
        const postImageName = oldImageUrl.split('/images/')[1];

        fs.unlink(`images/${postImageName}`, () => {
            let sql = "UPDATE posts SET image_url = ?, content = ?, updated_at = ? WHERE id = ?"
            sql = mysql.format(sql, [newImageUrl, content, date, id]);

            dbConnect.query(sql, (err, result) => {
                if (err) {
                    res.status(400).json({ error: err });
                } else {
                    res.status(200).json({ message: 'Post modifié avec succès'});
                }
            })
        })
    }
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
                        res.status(200).json({ message: 'Post supprimé avec succès'});
                    }
                })
            })
        }
    })
};