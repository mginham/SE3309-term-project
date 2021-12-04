const mysql = require('mysql');
const credentials = JSON.parse(fs.readFileSync('credentials.json'));

// connect to MySQL database on GCP
function newConnection() {
    let conn = mysql.createConnection({
        host: credentials.host,
        user: credentials.user,
        password: credentials.password,
        database: credentials.database
    });
    return conn;
}
module.exports = newConnection;