const express = require('express');
const mysql = require('mysql');

const fs = require('fs');
const credentials = JSON.parse(fs.readFileSync('credentials.json'));

let connection = mysql.createConnection({
    host: credentials.host,
    user: credentials.user,
    password: credentials.password,
    database: credentials.database
});

const app = express();


app.post('/login', (req, res) => {
    connection.query(
        `
            SELECT * FROM EMPLOYEE WHERE EMAIL = "${req.body.email}"
        `,
        (err, rows, fields) => {
            if (err) {
                // raise the error to the client
                console.log(err);
                res.status(500).send(err);
            }
            else {
                // return the first email
                res.send(r[0]);
            }
        }
    );
    // should not be reachable as long as the database query succeeded
    res.status(500).send('Database query failed.');
});


app.post('/makecardholder', (req, res) => {
    connection.query(
        `
            
        `,
        (err, rows, fields) => {
            if (err) {
                // raise the error to the client
                console.log(err);
                res.status(500).send(err);
            }
            else {
                // inform that the request was successful
                res.send('Success');
            }
        }
    );
    // should not be reachable as long as the database query succeeded
    res.status(500).send('Database query failed.');
});


app.post('/makereservation', (req, res) => {

});


app.post('/returnbook', (req, res) => {

});


app.post('/payfeebalance', (req, res) => {

});


app.get('/searchbookname', (req, res) => {

});


app.get('/getpopularbook', (req, res) => {

});
