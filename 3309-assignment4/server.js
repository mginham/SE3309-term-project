const express = require('express'); // get express packages for express server

const newConnection = require('./DBConnection'); // connect to SQL data base script

const conn = newConnection(); // initilize connection
conn.connect(); // connect to MySQL db hosted on GCP

const app = express(); // Start express server
const cors = require('cors'); // Cors packages, Cross-origin resource sharing
app.use(cors()); // allow front-end to send resources to server and vice versa

const bodyParser = require('body-parser'); // middleware 
app.use(bodyParser.json()); // use middleware to read requests and responses in JSON format

// Demo: Used harrischristopher@example.com
// To handle logins
app.post('/login', (req, res) => {
    try {
        // query database
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
// Signning-out book
app.post('/makereservation', (req, res) => {
    try {
        var today = new Date(); // today's date
        var current = today.getFullYear() + '-' + (today.getMonth() + 1) + '-' + today.getDate(); // format date to yyyy-mm-dd
        var addMonth = new Date(today.setMonth(today.getMonth() + 1)); // book due next month
        var due = addMonth.getFullYear() + '-' + (addMonth.getMonth() + 1) + '-' + addMonth.getDate(); // format due date to yyyy-mm-dd
        // Insert query
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

// when cardholder returns book
app.post('/returnbook', (req, res) => {
    try {
        // update query to update reservation with book returned date, calculate any overdue fees, and update the cardholder's account
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
// Search for a book by part of name and genre
app.post('/searchBook', (req, res) => {
    try {
        let books = [] // store database results
        // find books with written by user inputted author name and genre
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
                    for (r of rows) { // iterate through results
                        // add book to result array
                        books.push({
                            'Title': r.book_Title,
                            'Author': r.author_Name,
                            'Genre': r.genre
                        })
                    }
                    res.send(books); // send results
                }
            }
        )
    }
    catch {
        res.status(500).send('Server error - try again later');
    }
});

// get most read books
app.get('/getPopularChoice', (req, res) => {
    try {
        // query to get books that have been signed out the most
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
                    let books = [] // stores results
                    for (r of rows) { // iterate through the results
                        books.push({ // add book to results
                            'Title': r.book_Title,
                            'Times Reserved': r.numberOfReservations,
                        })
                    }
                    res.send(books); // send results to frontend
                }
            }
        )
    }
    catch {
        res.status(500).send('Server error - try again later');
    }
});

// get all reservations under a cardholder
app.post('/getReservations', (req, res) => {
    try {
        // query to get reservation history for a particular cardholder
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
                    for (r of rows) {
                        reservations.push({
                            'ID': r.reservation_ID,
                            "Email": r.email,
                            'Serial Number': r.serial_Number,
                            'Start': r.reservation_Start.getFullYear() + '-' + (1 + r.reservation_Start.getMonth()) + '-' + r.reservation_Start.getDate(), // format date
                            'Deadline': r.reservation_Deadline.getFullYear() + '-' + (1 + r.reservation_Deadline.getMonth()) + '-' + r.reservation_Deadline.getDate(),
                            'Returned': r.book_Returned_Date === null ? null : r.book_Returned_Date.getFullYear() + '-' + (1 + r.book_Returned_Date.getMonth()) + '-' + r.book_Returned_Date.getDate()
                        })
                    }
                    res.send(reservations); // send reservations
                }
            }
        )
    }
    catch {
        res.status(500).send('Server error - try again later');
    }
});

// get outstanding fee balance for a cardholder
app.get('/feeBalance', (req, res) => {
    try {
        // query database to see if cardholder owes any money
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
                    if (rows[0].fee_Balance) { // get fee balance field
                        res.send(rows[0].fee_Balance.toString()); // send fee balance as reply
                    }
                    else { // if null
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
// check availibility of a book at a library
app.post('/bookAvailable', (req, res) => {
    try {
        // query to check a book is available at a library and have not been signed out by someone else
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
                    for (r of rows) { // for copies in the library
                        books.push({ // add book
                            'Title': r.book_Title,
                            'Serial Number': r.serial_Number
                        })
                    }
                    res.send(books); // send available copies
                }
            }
        )
    }
    catch {
        res.status(500).send('Server error - try again later');
    }
})

// get list of libraries
app.get('/getLibraries', (req, res) => {
    try {
        // get all libarires
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
                    let libraries = [] // list of libraries
                    for (r of rows) { // add library to libararies list
                        libraries.push(r.library_Name)
                    }
                    res.send(libraries); // send libarires
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