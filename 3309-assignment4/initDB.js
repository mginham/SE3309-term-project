// Initializing database, loading in data, and resetting database

const mysql = require('mysql');

// read database login info from a credentials JSON
const fs = require('fs');
const credentials = JSON.parse(fs.readFileSync('credentials.json'));

// connect to GCP MySQL
let conn = mysql.createConnection({
    host: credentials.host,
    user: credentials.user,
    password: credentials.password,
    database: credentials.database
});


