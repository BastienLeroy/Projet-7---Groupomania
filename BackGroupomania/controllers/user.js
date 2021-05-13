const mysql = require('mysql');
const dbConnect = require('../config/dbConnect');
const fs = require('fs');


// Modifier information utilisateur
exports.modifyUser = (req, res, next) => {
    const bodyParsed = JSON.parse(req.body.dataInput);

    const { id, name, firstname, email, password  } = bodyParsed;
    const imageUrl = typeof req.file !== 'undefined' ? `${req.protocol}://${req.get('host')}/images/${req.baseUrl === '/api/user' ? 'users' : 'posts'}/${req.file.filename}` : req.body.imageUrl;
    const date  = new Date().toISOString().slice(0, 19).replace('T', ' ');
    
    let sql;
    if (typeof password === 'undefined') {
        sql = "UPDATE users SET image_url = ?, name = ?, firstname = ?, email = ?, updated_at = ? WHERE id = ?"
        sql = mysql.format(sql, [imageUrl, name, firstname, email, date, id]);
    } else {
        sql = "UPDATE users SET image_url = ?, name = ?, firstname = ?, email = ?, password = ?, updated_at = ? WHERE id = ?"
        sql = mysql.format(sql, [imageUrl, name, firstname, email, password, date, id]);
    }

    dbConnect.query(sql, (err, result) => {
        if (err) {
            res.status(400).json({ error: err });
        } else {
            res.status(201).json({ message: 'Utilisateur modifié avec succès'});
        }
    })
};

// Supprimer utilisateur
exports.deleteUser = (req, res, next) => {
    const { id } = req.body;

    let sqlgetInfoPost = 'SELECT image_url FROM `users` WHERE id = ?';
    sqlgetInfoPost = mysql.format(sqlgetInfoPost, [id]);

    dbConnect.query(sqlgetInfoPost, (err, post) => {
        if (err) {
            res.status(400).json({ error: err });
        } else if (!post[0].image_url) {
            let sql = "DELETE FROM `users` WHERE id = ?"
            sql = mysql.format(sql, [id]);
            dbConnect.query(sql, (err, result) => {
                if (err) {
                    res.status(400).json({ error: err });
                } else {
                    res.status(201).json({ message: 'Utilisateur supprimé avec succès'});
                }
            })
        } else {
            const postImageName = post[0].image_url.split('/images/')[1];

            fs.unlink(`images/${postImageName}`, (err) => {
                if (err) {
                    res.status(400).json({ error: err });
                } else {
                    let sql = "DELETE FROM `users` WHERE id = ?"
                    sql = mysql.format(sql, [id]);
                    dbConnect.query(sql, (err, result) => {
                        if (err) {
                            res.status(400).json({ error: err });
                        } else {
                            res.status(201).json({ message: 'Utilisateur supprimé avec succès'});
                        }
                    })
                }
            })
        }
    })
};