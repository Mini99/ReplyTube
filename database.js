const mysql = require('mysql');

class Database {

    constructor() {
        this.connect();
    }

    connect() {
        const connection = mysql.createConnection({
            host: 'localhost',
            user: 'root',
            password: '',
            database: 'replytube'
        });
        connection.connect((err) => {
            if (err) throw err;
            console.log('Connected to MySQL Server!');
        });
    }
}

module.exports = new Database();