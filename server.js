const express = require('express');
const mysql = require('mysql');
const cors = require('cors');
const bodyParser = require('body-parser');
const app = express();
const port = 3000;

app.use(cors());
app.use(bodyParser.json());

const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '159753',
    database: 'graphs'
});

db.connect((err) => {
    if (err) throw err;
    console.log('Connected to the database!');
});

app.get('/data', (req, res) => {
    const query = 'SELECT * FROM graph_1';
    db.query(query, (err, results) => {
        if (err) throw err;
        const formattedResults = results.map(row => ({
            source: row.source,
            target: row.target
        }));
        res.json(formattedResults);
    });
});

app.post('/reload-data', (req, res) => {
    const edges = req.body;
    const validEdges = edges.filter(edge => edge.source && edge.target);

    const deleteQuery = 'DELETE FROM graph_1';

    db.query(deleteQuery, (err) => {
        if (err) {
            console.error(err);
            return res.status(500).send('Error clearing existing data.');
        }

        if (validEdges.length > 0) {
            const insertQuery = 'INSERT INTO graph_1 (source, target) VALUES ?';
            const values = validEdges.map(edge => [edge.source, edge.target]);

            db.query(insertQuery, [values], (err) => {
                if (err) {
                    console.error(err);
                    return res.status(500).send('Error inserting new edges.');
                }
                res.status(200).send('Data replaced successfully.');
            });
        } else {
            res.status(400).send('No valid edges provided.');
        }
    });
});

// Add this endpoint to handle adding edges
app.post('/add-edge', (req, res) => {
    const { source, target } = req.body;

    if (!source || !target) {
        return res.status(400).send('Source and target are required.');
    }

    const query = 'INSERT INTO graph_1 (source, target) VALUES (?, ?)';
    db.query(query, [source, target], (err) => {
        if (err) {
            console.error(err);
            return res.status(500).send('Error adding edge to the database.');
        }
        res.status(200).send('Edge added successfully.');
    });
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
