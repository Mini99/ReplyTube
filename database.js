const mysql = require('mysql');

class Database {

    constructor() {
        this.connect();
    }

    connect() {
        const connection = mysql.createConnection({
            host: process.env.DATABASE_HOST,
            user: process.env.DATABASE_USER,
            password: process.env.DATABASE_PASSWORD,
            database: process.env.DATABASE
        });
        connection.connect((err) => {
            if (err) throw err;
            console.log('Connected to MySQL Server!');
        });
    }
}

module.exports = new Database();