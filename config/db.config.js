"use strict";
const mysql = require("mysql2");

const dbConn = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '135&robert081299',
    database: 'isitempty_db',
    connectTimeout: 10000
});

dbConn.connect(function (err) {
    if (err) {
        console.error("Error connecting to the database:", err.message);
        return;
    }
    console.log("Database Connected");
});

module.exports = dbConn;