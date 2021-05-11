const mysql = require('mysql');
const dbConnect = require('../config/dbConnect');


// Modifier information utilisateur
exports.modifyUser = (req, res, next) => {
    const { id, name, firstname, email, password  } = req.body;
    const imageUrl = typeof req.file !== 'undefined' ? `${req.protocol}://${req.get('host')}/images/${req.file.filename}` : req.body.imageUrl;
    const date  = new Date().toISOString().slice(0, 19).replace('T', ' ');
    
    let sql = "UPDATE users SET image_url = ?, name = ?, firstname = ?, password = ?, updated_at = ? WHERE id = ?"
    sql = mysql.format(sql, [imageUrl, name, firstname, email, password, date, id]);

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
        } else {
            const postImageName = post[0].image_url.split('/images/')[1];

            fs.unlink(`images/${postImageName}`, () => {
                let sql = "DELETE FROM `users` WHERE id = ?"
                sql = mysql.format(sql, [ id ]);
                dbConnect.query(sql, (err, result) => {
                    if (err) {
                        res.status(400).json({ error: err });
                    } else {
                        res.status(201).json({ message: 'Utilisateur supprimé avec succès'});
                    }
                })
            })
        }
    })
};