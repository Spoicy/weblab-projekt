const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt');
const fs = require('node:fs');
const jwt = require('jsonwebtoken');


const port = 8000; // local port
const app = express() // Initialize the express app

const RSA_PRIVATE_KEY = fs.readFileSync(__dirname + '/private.key');

const adminCheck = (req, res) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (token == null) return false;
    if (token == undefined) return false;

    jwt.verify(token, RSA_PRIVATE_KEY, (err, user) => {
        console.log(err);
        if (err) {
            return false;
        }
        if (user.sub == 'cto_admin') {
            console.log('admin')
        } else {
            return false;
        }
    })
    return true;
}

// mysql database connection
const db = mysql.createPool({
    connectionLimit: 10,
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME,
});

app.use(express.json())

// Middleware
app.use(bodyParser.json());
app.use(cors())

app.get("/", (req, res) => {
    res.json("API reached successfully!");
});

app.post('/login', (req, res) => {
    try {
        const { username, password } = req.body;
        const q = 'SELECT * FROM user WHERE name = ?';
        const qHistory = 'INSERT INTO login_history (login_at, user_id) VALUES (?, ?)';
        db.query(q, [username], (err, data) => {
            if (err) {
                console.error('Error during fetch:', err);
                return res.status(500).json({ success: false, message: 'An error occurred' });
            }
            bcrypt
                .compare(password, data[0].hashed_pass)
                .then(response => {
                    if (response) {
                        const jwtBearerToken = jwt.sign({}, RSA_PRIVATE_KEY, {
                            algorithm: 'RS256',
                            expiresIn: 7200,
                            subject: username
                        })
                        let dateObj = new Date();
                        const historyValues = [Math.floor(dateObj.getTime() / 1000), data[0].id];
                        db.query (qHistory, historyValues, (err, data) => {
                            if (err) {
                                console.error('Error during insert:', err);
                                return res.status(500).json({ success: false, message: 'An error occurred' });
                            }
                        })
                        return res.status(200).json({ success: true, idToken: jwtBearerToken, expiresIn: 7200 });
                    }
                })
                .catch(err => console.error(err.message))
        });
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ success: false, message: 'An error occurred' });
    }
});

app.get('/login/verify', (req, res) => {
    if (!adminCheck(req, res)) {
        return res.status(401).json({ admin: false });
    }
    res.status(200).json({ admin: true });
});

// contact form route
app.post('/technology/add', (req, res) => {
    if (!adminCheck(req, res)) {
        return res.status(401).json({ success: false, message: 'Unauthorized' });
    }
    try {
        const { name, category, ring, descTechnology, descClassification } = req.body;
        const q = 'INSERT INTO technology (name, category, ring, desc_technology, desc_classification, published, created_by, created_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?)';
        let dateObj = new Date();
        const values = [name, category, ring, descTechnology, descClassification, false, 1, Math.floor(dateObj.getTime() / 1000)];

        db.query(q, values, (err, data) => {
            if (err) {
                console.error('Error during submission:', err);
                return res.status(500).json({ success: false, message: 'An error occurred' });
            }
            res.status(200).json({ success: true, message: 'Tech sent successfully' });
        });
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ success: false, message: 'An error occurred' });
    }
});

app.put('/technology/publish', (req, res) => {
    if (!adminCheck(req, res)) {
        return res.status(401).json({ success: false, message: 'Unauthorized' });
    }
    try {
        const { id, ring, descClassification } = req.body;
        const q = 'UPDATE technology SET ring = ?, desc_classification = ?, published = true, published_at = ? WHERE id = ?';
        const qOld = 'SELECT * FROM technology WHERE id = ?';
        const qHistoryPub = 'INSERT INTO change_history (change_type, changes, changed_at, changed_by, tech_id) VALUES (?, ?, ?, ?, ?)';
        const qHistoryUpdate = 'INSERT INTO change_history (change_type, changes, changed_at, changed_by, tech_id) VALUES (?, ?, ?, ?, ?)';
        let dateObj = new Date();
        const values = [ring, descClassification, Math.floor(dateObj.getTime() / 1000), id];
        const oldValues = [id];
        const historyValuesPub = ['publish', JSON.stringify([]), Math.floor(dateObj.getTime() / 1000), 1, id];
        //const historyValuesUpdate = ['update', Math.floor(dateObj.getTime() / 1000), 1, id];

        // Get old data before changes
        db.query(qOld, oldValues, (err, dataOld) => {
            if (err) {
                console.error('Error during old fetch:', err);
                return res.status(500).json({ success: false, message: 'An error occurred' });
            }
            // Check for changes
            let changes = [];
            if (dataOld[0].ring != ring) {
                changes.push({ring: ring});
            }
            if (dataOld[0].desc_classification != descClassification) {
                changes.push({ desc_classification: descClassification });
            }
            const historyValuesUpdate = ['update', JSON.stringify(changes), Math.floor(dateObj.getTime() / 1000), 1, id];
            // Change data
            db.query(q, values, (err, data) => {
                if (err) {
                    console.error('Error during update:', err);
                    return res.status(500).json({ success: false, message: 'An error occurred' });
                }
                // History inserts
                db.query(qHistoryPub, historyValuesPub, (err, data) => {
                    if (err) {
                        console.error('Error during insert:', err);
                        return res.status(500).json({ success: false, message: 'An error occurred' });
                    }
                });
                db.query(qHistoryUpdate, historyValuesUpdate, (err, data) => {
                    if (err) {
                        console.error('Error during insert:', err);
                        return res.status(500).json({ success: false, message: 'An error occurred' });
                    }
                });
                res.status(200).json({ success: true, message: 'Tech updated successfully' });
            });
        });

    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ success: false, message: 'An error occurred' });
    }
});

app.put('/technology/update', (req, res) => {
    if (!adminCheck(req, res)) {
        return res.status(401).json({ success: false, message: 'Unauthorized' });
    }
    try {
        const { id, name, category, ring, descTechnology, descClassification } = req.body;
        const q = 'UPDATE technology SET name = ?, category = ?, ring = ?, desc_technology = ?, desc_classification = ? WHERE id = ?';
        const qOld = 'SELECT * FROM technology WHERE id = ?';
        const qHistoryUpdate = 'INSERT INTO change_history (change_type, changes, changed_at, changed_by, tech_id) VALUES (?, ?, ?, ?, ?)';
        let dateObj = new Date();
        const valuesUpdate = [name, category, ring, descTechnology, descClassification, id];
        const oldValues = [id];

        db.query(qOld, oldValues, (err, dataOld) => {
            if (err) {
                console.error('Error during old fetch:', err);
                return res.status(500).json({ success: false, message: 'An error occurred' });
            }
            let changes = [];
            if (dataOld[0].name != name) {
                changes.push({ name: name });
            }
            if (dataOld[0].category != category) {
                changes.push({ category: category });
            }
            if (dataOld[0].ring != ring) {
                changes.push({ ring: ring });
            }
            if (dataOld[0].desc_technology != descTechnology) {
                changes.push({ desc_technology: descTechnology });
            }
            if (dataOld[0].desc_classification != descClassification) {
                changes.push({ desc_classification: descClassification });
            }
            const historyValuesUpdate = ['update', JSON.stringify(changes), Math.floor(dateObj.getTime() / 1000), 1, id];
            db.query(q, valuesUpdate, (err, data) => {
                if (err) {
                    console.error('Error during update:', err);
                    return res.status(500).json({ success: false, message: 'An error occurred' });
                }
                
                db.query(qHistoryUpdate, historyValuesUpdate, (err, data) => {
                    if (err) {
                        console.error('Error during insert:', err);
                        return res.status(500).json({ success: false, message: 'An error occurred' });
                    }
                });
                res.status(200).json({ success: true, message: 'Tech updated successfully' });
            });
        });
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ success: false, message: 'An error occurred' });
    }
});

app.get('/technology', (req, res) => {
    try {
        const q = 'SELECT * FROM technology WHERE published = true';
        db.query(q, (err, data) => {
            if (err) {
                console.error('Error during fetch:', err);
                return res.status(500).json({ success: false, message: 'An error occured' });
            }
            res.status(200).json(data);
        });
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ success: false, message: 'An error occurred' });
    }
});

app.get('/technology/unpublished', (req, res) => {
    if (!adminCheck(req, res)) {
        return res.status(401).json({ success: false, message: 'Unauthorized' });
    }
    try {
        const q = 'SELECT * FROM technology WHERE published = false';
        db.query(q, (err, data) => {
            if (err) {
                console.error('Error during fetch:', err);
                return res.status(500).json({ success: false, message: 'An error occured' });
            }
            res.status(200).json(data);
        });
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ success: false, message: 'An error occurred' });
    }
})

app.get('/technology/all', (req, res) => {
    if (!adminCheck(req, res)) {
        return res.status(401).json({ success: false, message: 'Unauthorized' });
    }
    try {
        const q = 'SELECT * FROM technology';
        db.query(q, (err, data) => {
            if (err) {
                console.error('Error during fetch:', err);
                return res.status(500).json({ success: false, message: 'An error occured' });
            }
            res.status(200).json(data);
        });
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ success: false, message: 'An error occurred' });
    }
})

app.listen(port, () => {
    console.log(`Connected to backend on port ${port}`)
});