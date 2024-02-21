const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
const bodyParser = require('body-parser');

const port = 8000; // local port
const app = express() // Initialize the express app

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
app.post

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

app.get('/technology', (req, res) => {
    try {
        const q = 'SELECT * FROM technology';
        db.query(q, (err, data) => {
            if (err) {
                console.error('Error during fetch:', err);
                return res.status(500).json({ success: false, message: 'An error occured' });
            }
            res.status(200).json(data);
        })
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ success: false, message: 'An error occurred' });
    }
});

app.listen(port, () => {
    console.log(`Connected to backend on port ${port}`)
});