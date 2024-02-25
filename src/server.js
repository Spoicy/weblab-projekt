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
    console.log('entering');
    try {
        const { username, password } = req.body;
        const q = 'SELECT * FROM user WHERE name = "cto_admin"';
        console.log('querying', username, password)
        db.query(q, (err, data) => {
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
    const authHeader = req.headers['authorization'];
    console.log(authHeader);
    const token = authHeader && authHeader.split(' ')[1];
    console.log('checking');

    if (token == null) return res.status(401);
    console.log('e');

    jwt.verify(token, RSA_PRIVATE_KEY, (err, user) => {
        console.log('heyyy');
        console.log(err);
        if (err) {
            return res.status(403);
        }
        console.log(user.sub);
        if (user.sub == 'cto_admin') {
            console.log('yes?')
            res.status(200).json({ admin: true });
        }
    })
    
});

// contact form route
app.post('/technology/add', (req, res) => {
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
    try {
        const { id, ring, descClassification } = req.body;
        console.log(id);
        const q = 'UPDATE technology SET ring = ?, desc_classification = ?, published = true, published_at = ? WHERE id = ?';
        let dateObj = new Date();
        const values = [ring, descClassification, Math.floor(dateObj.getTime() / 1000), id];


        db.query(q, values, (err, data) => {
            if (err) {
                console.error('Error during update:', err);
                return res.status(500).json({ success: false, message: 'An error occurred' });
            }
            res.status(200).json({ success: true, message: 'Tech updated successfully' });
        });
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ success: false, message: 'An error occurred' });
    }
});

app.put('/technology/update', (req, res) => {
    try {
        const { id, name, category, ring, descTechnology, descClassification } = req.body;
        console.log(id);
        const q = 'UPDATE technology SET name = ?, category = ?, ring = ?, desc_technology = ?, desc_classification = ? WHERE id = ?';
        let dateObj = new Date();
        const valuesUpdate = [name, category, ring, descTechnology, descClassification, id];
        const valuesChange = [Math.floor(dateObj.getTime() / 1000)];

        db.query(q, valuesUpdate, (err, data) => {
            console.log(data)
            if (err) {
                console.error('Error during update:', err);
                return res.status(500).json({ success: false, message: 'An error occurred' });
            }
            res.status(200).json({ success: true, message: 'Tech updated successfully' });
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