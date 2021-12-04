const express = require('express');
const mysql = require('mysql');

const newConnection = require('./DBConnection');

const app = express();
const cors = require('cors');
app.use(cors());

const bodyParser = require('body-parser');
app.use(bodyParser.json());

app.post('/login', (req, res) => {
    let conn = newConnection();
    conn.connect();
    conn.query(
        `
            SELECT * FROM employee WHERE EMAIL = "${req.body.email}"
        `,
        (err, rows, fields) => {
            if (err) {
                // raise the error to the client
                console.log(err);
                res.status(500).send(err);
            }
            else {
                // is an employee
                res.send(true);
            }
        }
    );
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
});

app.post('/searchBook', (req, res) => {
    let conn = newConnection();
    conn.connect();
    conn.query(
        `
        SELECT a.author_ID, a.author_Name, b.book_Title, b.isbn, b.genre, p.isbn, p.author_ID
        FROM author a
        INNER JOIN PublishTransaction p ON a.author_ID = p.author_ID
        INNER JOIN Book b ON p.isbn = b.isbn
        WHERE author_Name LIKE '%${req.query.author}%' AND genre="${req.query.genre}";
        `
    ),
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
});

app.get('/getPopularChoice', (req, res) => {
    let conn = newConnection();
    conn.connect();
    conn.query(
        `
        SELECT COUNT(reservation_ID) as total_Reservations 
        FROM reservation 
        WHERE serial_Number IN (
        SELECT serial_Number 
        FROM copy 
        WHERE isbn IN (
        SELECT isbn 
        FROM book 
        WHERE book_Title = ${req.query.bookTitle}))
        `
    ),
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
});

const port = 5000
app.listen(port, () => {
    console.log(`Listening on port ${port}...`)
});