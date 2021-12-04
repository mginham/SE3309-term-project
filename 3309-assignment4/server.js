const express = require('express');
const mysql = require('mysql');

const fs = require('fs');
const newConnection = require('./DBConnection');

const app = express();


app.post('/login', (req, res) => {
    let conn = newConnection();
    conn.connect();
    conn.query(
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
    let conn = newConnection();
    conn.connect();
    conn.query(
        `
        INSERT INTO cardholder(email, creator_SIN, cardholder_Name, home_Address, birthday)
        VALUES (
            ${req.query.email},
            ${req.query.creator_SIN},
            ${req.query.cardholder_Name},
            ${req.query.home_Address},
            ${req.query.birthday}
        );
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
