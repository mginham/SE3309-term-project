const express = require('express');
const mysql = require('mysql');

const newConnection = require('./DBConnection');

const conn = newConnection();
conn.connect();

const app = express();
const cors = require('cors');
app.use(cors());

const bodyParser = require('body-parser');
app.use(bodyParser.json());

// Demo: Used harrischristopher@example.com
app.post('/login', (req, res) => {
    try {
        conn.query(
            `
                SELECT * FROM employee WHERE EMAIL = "${req.body.email}"
            `,
            (err, rows, fields) => {
                if (err) {
                    // raise the error to the client
                    console.log(err);
                    res.status(500).send(err.sqlMessage);
                }
                else {
                    if (rows.length > 0) {
                        // is an employee
                        res.send(true);
                    }
                    else {
                        res.status(403).send('Login not recognized');
                    }
                }
            }
        );
    }
    catch {
        res.status(500).send('Server error - try again later');
    }
});

// Demo: Swindlers and wizards from popular books, markham copy to laurazimmerman@example.org
app.post('/makereservation', (req, res) => {
    try {
        var today = new Date();
        var current = today.getFullYear() + '-' + (today.getMonth() + 1) + '-' + today.getDate();
        var addMonth = new Date(today.setMonth(today.getMonth() + 1));
        var due = addMonth.getFullYear() + '-' + (addMonth.getMonth() + 1) + '-' + addMonth.getDate();
        conn.query(
            `
            INSERT INTO reservation(serial_Number, email, reservation_Start, reservation_Deadline, overdue_Fee)
            VALUES (
                "${req.body.serial_Number}",
                "${req.body.email}",
                "${current}",
                "${due}",
                "0.05"
            );
            `,
            (err, rows, fields) => {
                if (err) {
                    // raise the error to the client
                    console.log(err);
                    res.status(500).send(err.sqlMessage);
                }
                else {
                    // inform that the request was successful
                    res.send('Success');
                }
            }
        );
    }
    catch {
        res.status(500).send('Server error - try again later');
    }
});


app.post('/returnbook', (req, res) => {
    try {
        conn.query(
            `
                UPDATE reservation, (SELECT * 
                FROM reservation
                WHERE reservation.serial_Number = ${req.body.serial_Number}
                ORDER BY reservation.reservation_Start DESC
                LIMIT 1) AS r
                INNER JOIN cardholder ON r.email = cardholder.email
                SET reservation.book_Returned_Date = curdate(),
                cardholder.fee_Balance = cardholder.fee_Balance + GREATEST(DATEDIFF(curdate(), r.reservation_Deadline), 0)*r.overdue_Fee
                WHERE reservation.reservation_ID = r.reservation_ID;
            `,
            (err, rows, fields) => {
                if (err) {
                    // raise the error to the client
                    console.log(err);
                    res.status(500).send(err.sqlMessage);
                }
                else {
                    // inform that the request was successful
                    res.send('Success');
                }
            }
        );
    }
    catch {
        res.status(500).send('Server error - try again later');
    }
});

// Demo: author Amy, writes mystery
app.post('/searchBook', (req, res) => {
    try {

        let books = []
        conn.query(
            `
            SELECT a.author_ID, a.author_Name, b.book_Title, b.isbn, b.genre, p.isbn, p.author_ID
            FROM author a
            INNER JOIN publishtransaction p ON a.author_ID = p.author_ID
            INNER JOIN book b ON p.isbn = b.isbn
            WHERE author_Name LIKE '%${req.body.author}%' AND genre="${req.body.genre}";
            `
            ,
            (err, rows, fields) => {
                if (err) {
                    // raise the error to the client
                    console.log(err);
                    res.status(500).send(err.sqlMessage);
                }
                else {
                    for (r of rows) {
                        books.push({
                            'Title': r.book_Title,
                            'Author': r.author_Name,
                            'Genre': r.genre
                        })
                    }
                    res.send(books);
                }
            }
        )
    }
    catch {
        res.status(500).send('Server error - try again later');
    }
});

app.get('/getPopularChoice', (req, res) => {
    try {
        conn.query(
            `
            select COUNT(copy.isbn) as numberOfReservations, book.book_Title 
            from reservation
            INNER JOIN copy ON reservation.serial_Number = copy.serial_Number
            INNER JOIN book ON copy.isbn = book.isbn
            GROUP BY copy.isbn
            ORDER BY numberOfReservations DESC
            LIMIT 5;
            `
            ,
            (err, rows, fields) => {
                if (err) {
                    // raise the error to the client
                    console.log(err);
                    res.status(500).send(err.sqlMessage);
                }
                else {
                    // return the found books
                    let books = []
                    for (r of rows) {
                        books.push({
                            'Title': r.book_Title,
                            'Times Reserved': r.numberOfReservations,
                        })
                    }
                    res.send(books);
                }
            }
        )
    }
    catch {
        res.status(500).send('Server error - try again later');
    }
});

app.post('/getReservations', (req, res) => {
    try {
        conn.query(
            `
            select * from reservation
            WHERE email = "${req.body.email}";
            `
            ,
            (err, rows, fields) => {
                if (err) {
                    // raise the error to the client
                    console.log(err);
                    res.status(500).send(err.sqlMessage);
                }
                else {
                    // return the found books
                    let reservations = []
                    //today.getFullYear() + '-' + today.getMonth() + '-' + today.getDate();
                    for (r of rows) {
                        reservations.push({
                            'ID': r.reservation_ID,
                            "Email": r.email,
                            'Serial Number': r.serial_Number,
                            'Start': r.reservation_Start.getFullYear() + '-' + (1 + r.reservation_Start.getMonth()) + '-' + r.reservation_Start.getDate(),
                            'Deadline': r.reservation_Deadline.getFullYear() + '-' + (1 + r.reservation_Deadline.getMonth()) + '-' + r.reservation_Deadline.getDate(),
                            'Returned': r.book_Returned_Date === null ? null : r.book_Returned_Date.getFullYear() + '-' + (1 + r.book_Returned_Date.getMonth()) + '-' + r.book_Returned_Date.getDate()
                        })
                    }
                    res.send(reservations);
                }
            }
        )
    }
    catch {
        res.status(500).send('Server error - try again later');
    }
});

app.get('/feeBalance', (req, res) => {
    try {
        conn.query(
            `
            SELECT fee_Balance FROM cardholder
            WHERE email="${req.query.email}";
            `
            ,
            (err, rows, fields) => {
                if (err) {
                    // raise the error to the client
                    console.log(err);
                    res.status(500).send(err.sqlMessage);
                }
                else {
                    if (rows[0].fee_Balance) {
                        res.send(rows[0].fee_Balance.toString());
                    }
                    else {
                        res.send('0');
                    }
                }
            }
        )
    }
    catch {
        res.status(500).send('Server error - try again later');
    }
})

// demo: use wizards from popular books and 1 copy is available at markham library
app.post('/bookAvailable', (req, res) => {
    try {
        conn.query(
            `
            select book_Title, copy.serial_Number from copy
            INNER JOIN library on copy.library_Address = library.library_Address
            INNER JOIN book ON book.isbn = copy.isbn
            INNER JOIN reservation ON copy.serial_Number = reservation.serial_Number
            WHERE book_Title LIKE "%${req.body.book_Title}%"
            AND library_Name LIKE "%${req.body.libraryName}%"
            AND reservation_ID IS NOT null AND book_Returned_Date IS NOT null;
            `
            ,
            (err, rows, fields) => {
                if (err) {
                    // raise the error to the client
                    console.log(err);
                    res.status(500).send(err.sqlMessage);
                }
                else {
                    let books = []
                    for (r of rows) {
                        books.push({
                            'Title': r.book_Title,
                            'Serial Number': r.serial_Number
                        })
                    }
                    res.send(books);
                }
            }
        )
    }
    catch {
        res.status(500).send('Server error - try again later');
    }
})

app.get('/getLibraries', (req, res) => {
    try {
        conn.query(
            `
            SELECT * FROM library;
            `
            ,
            (err, rows, fields) => {
                if (err) {
                    // raise the error to the client
                    console.log(err);
                    res.status(500).send(err.sqlMessage);
                }
                else {
                    let libraries = []
                    for (r of rows) {
                        libraries.push(r.library_Name)
                    }
                    res.send(libraries);
                }
            }
        )
    }
    catch {
        res.status(500).send('Server error - try again later');
    }
})

const port = 5000
app.listen(port, () => {
    console.log(`Listening on port ${port}...`)
});