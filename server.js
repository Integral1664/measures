const { Pool } = require('pg');
const express = require('express');
const path = require('path');
const app = express();

const pool = new Pool({
    user: 'postgres',        // PostgreSQL username
    host: 'localhost',            // Server hosting the database
    database: 'global',           // Database name
    password: '12345678',    // PostgreSQL password
    port: 5432,                   // Default PostgreSQL port
});

const itpool = new Pool({
    user: 'postgres',        // PostgreSQL username
    host: 'localhost',            // Server hosting the database
    database: 'it',           // Database name
    password: '12345678',    // PostgreSQL password
    port: 5432,                   // Default PostgreSQL port
});
app.use(express.json());
// Test the connection
pool.connect((err) => {
    if (err) {
        console.error('Error connecting to the GLOBAL database', err);
    } else {
        console.log('Connected to the PostgreSQL database');
    }
});
itpool.connect((err) => {
    if (err) {
        console.error('Error connecting to the IT database', err);
    } else {
        console.log('Connected to the PostgreSQL database');
    }
});


const PORT = 3000;

// Middleware to serve static files from 'public' directory
app.use(express.static(path.join(__dirname, 'www/')));

app.get('/measures', async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM measures');
        if (result.rows.length === 0) {
            res.status(404).send('Measures not found');
        } else {
            res.json(result);
        }
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Error fetching user');
    }
});
app.get('/measures/tax_incentives', async (req, res) => {
    try {
        const result = await itpool.query('SELECT * FROM tax_incentives');
        if (result.rows.length === 0) {
            res.status(404).send('Taxes not found');
        } else {
            res.json(result);
        }
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Error fetching taxes');
    }
});

app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});