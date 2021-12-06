const mysql = require('mysql'); // mysql dependecies to work with MySQL db on GCP

// connect to MySQL database on GCP
function newConnection() {
    let conn = mysql.createConnection({
        host: "34.130.137.116", // ip address of db
        user: "root", // username
        password: "western", // password
        database: "librarydb" // database name
    });
    return conn;
}
module.exports = newConnection;