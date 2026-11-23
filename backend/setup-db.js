
require("dotenv").config();

const mysql = require("mysql2");

const connection = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT || 3306
});

// Create database and table
connection.connect((err) => {
    if (err) {
        console.error("MySQL connection failed:", err.message);
        process.exit(1);
    }

    console.log("Connected to AWS RDS!");

    connection.query(
        "CREATE DATABASE IF NOT EXISTS todoapp",
        (err) => {
            if (err) {
                console.error("Database creation failed:", err.message);
                connection.end();
                process.exit(1);
            }

            console.log("Database created successfully!");

            connection.changeUser(
                { database: "todoapp" },
                (err) => {
                    if (err) {
                        console.error(err.message);
                        connection.end();
                        process.exit(1);
                    }

                    const sql = `
                        CREATE TABLE IF NOT EXISTS todos (
                            id INT AUTO_INCREMENT PRIMARY KEY,
                            title VARCHAR(255) NOT NULL,
                            completed BOOLEAN DEFAULT FALSE,
                            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
                        )
                    `;

                    connection.query(sql, (err) => {
                        if (err) {
                            console.error(
                                "Table creation failed:",
                                err.message
                            );
                            connection.end();
                            process.exit(1);
                        }

                        console.log("Todos table created successfully!");

                        connection.end();
                    });
                }
            );
        }
    );
});
