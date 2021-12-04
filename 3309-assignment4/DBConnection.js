const mysql = require('mysql');

// connect to MySQL database on GCP
function newConnection() {
    let conn = mysql.createConnection({
        host: "34.130.137.116",
        user: "root",
        password: "western",
        database: "librarydb"
    });
    return conn;
}
module.exports = newConnection;