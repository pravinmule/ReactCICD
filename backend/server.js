
require("dotenv").config();

const express = require("express");
const cors = require("cors");
const db = require("./db");

const app = express();

app.use(cors());
app.use(express.json());

// Test API
app.get("/", (req, res) => {
    res.send("Todo API is running!");
});

// GET all todos
app.get("/api/todos", (req, res) => {
    const sql = "SELECT * FROM todos ORDER BY id DESC";

    db.query(sql, (err, results) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }

        res.json(results);
    });
});

// CREATE todo
app.post("/api/todos", (req, res) => {
    const { title } = req.body;

    if (!title || !title.trim()) {
        return res.status(400).json({
            message: "Todo title is required"
        });
    }

    const sql = "INSERT INTO todos (title) VALUES (?)";

    db.query(sql, [title.trim()], (err, result) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }

        res.status(201).json({
            id: result.insertId,
            title: title.trim(),
            completed: false,
            message: "Todo created successfully"
        });
    });
});

// UPDATE todo
app.put("/api/todos/:id", (req, res) => {
    const { title, completed } = req.body;
    const { id } = req.params;

    const sql = `
        UPDATE todos
        SET title = ?, completed = ?
        WHERE id = ?
    `;

    db.query(sql, [title, completed, id], (err, result) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }

        if (result.affectedRows === 0) {
            return res.status(404).json({
                message: "Todo not found"
            });
        }

        res.json({
            message: "Todo updated successfully"
        });
    });
});

// DELETE todo
app.delete("/api/todos/:id", (req, res) => {
    const { id } = req.params;

    const sql = "DELETE FROM todos WHERE id = ?";

    db.query(sql, [id], (err, result) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }

        if (result.affectedRows === 0) {
            return res.status(404).json({
                message: "Todo not found"
            });
        }

        res.json({
            message: "Todo deleted successfully"
        });
    });
});

// Start server
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
