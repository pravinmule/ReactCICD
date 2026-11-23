
require("dotenv").config();

const mysql = require("mysql2");

const db = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: process.env.DB_PORT || 3306
});

db.connect((err) => {
    if (err) {
        console.log("Database connection failed:", err.message);
        return;
    }

    console.log("Connected to AWS RDS!");

    // Check database
    db.query("SELECT DATABASE()", (err, result) => {
        if (err) {
            console.log(err.message);
            return db.end();
        }

        console.log("Current Database:", result[0]["DATABASE()"]);

        // Check tables
        db.query("SHOW TABLES", (err, tables) => {
            if (err) {
                console.log(err.message);
                return db.end();
            }

            console.log("\nAvailable Tables:");
            console.table(tables);

            // Check Todo records
            db.query("SELECT * FROM todos", (err, todos) => {
                if (err) {
                    console.log(err.message);
                } else {
                    console.log("\nTodo Records:");
                    console.table(todos);
                }

                db.end();
            });
        });
    });
});
