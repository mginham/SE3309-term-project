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

app.post('/makereservation', (req, res) => {
    let conn = newConnection();
    conn.connect();
    var today = new Date();
    var current = today.getFullYear() + '-' + today.getMonth() + '-' + today.getDate();
    var due = today.getFullYear() + '-' + (today.getMonth() + 6) + '-' + today.getDate();
    conn.query(
        `
        INSERT INTO reservation(serial_Number, email, reservation_Start, reservation_Deadline)
        VALUES (
            ${req.query.serial_Number},
            ${req.query.email},
            ${current},
            ${due}
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


app.post('/returnbook', (req, res) => {
    let conn = newConnection();
    conn.connect();
    var today = new Date();
    var current = today.getFullYear() + '-' + today.getMonth() + '-' + today.getDate();
    conn.query(
        `
            UPDATE Reservation
            SET book_Returned_Date = current,
            IF book_Returned_Date > reservation_Deadline
                overdue_Fee = DATEDIFF(book_returned_Date, reservation_Deadline)*overdue_Fee
            WHERE reservation_id = ${req.query.reservationID};
        `
    )
});


app.post('/payfeebalance', (req, res) => {

});

app.post('/searchBook', (req, res) => {

});

app.get('/getpopularbook', (req, res) => {

});
