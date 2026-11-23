
import { useEffect, useState } from "react";
import "./App.css";

const API_URL = "http://localhost:5000/api/todos";

function App() {
  const [todos, setTodos] = useState([]);
  const [title, setTitle] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // GET API - Fetch all todos
  const fetchTodos = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await fetch(API_URL);

      if (!response.ok) {
        throw new Error("Failed to fetch todos");
      }

      const data = await response.json();
      setTodos(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Load todos when page opens
  useEffect(() => {
    fetchTodos();
  }, []);

  // POST API - Add todo
  const addTodo = async (e) => {
    e.preventDefault();

    if (!title.trim()) return;

    try {
      const response = await fetch(API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ title }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to add todo");
      }

      setTitle("");
      fetchTodos();
    } catch (err) {
      setError(err.message);
    }
  };

  // PUT API - Update todo
  const toggleTodo = async (todo) => {
    try {
      const response = await fetch(`${API_URL}/${todo.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title: todo.title,
          completed: !Boolean(todo.completed),
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to update todo");
      }

      fetchTodos();
    } catch (err) {
      setError(err.message);
    }
  };

  // DELETE API - Delete todo
  const deleteTodo = async (id) => {
    try {
      const response = await fetch(`${API_URL}/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Failed to delete todo");
      }

      fetchTodos();
    } catch (err) {
      setError(err.message);
    }
  };

  const completedCount = todos.filter(
    (todo) => Boolean(todo.completed)
  ).length;

  return (
    <div className="app">
      <div className="todo-container">

        <header className="header">
          <div className="logo">✓</div>
          <h1>My Todo App</h1>
          <p>Organize your day, one task at a time.</p>
        </header>

        <div className="stats">
          <div className="stat-card">
            <h2>{todos.length}</h2>
            <p>Total Tasks</p>
          </div>

          <div className="stat-card">
            <h2>{completedCount}</h2>
            <p>Completed</p>
          </div>

          <div className="stat-card">
            <h2>{todos.length - completedCount}</h2>
            <p>Pending</p>
          </div>
        </div>

        <form className="todo-form" onSubmit={addTodo}>
          <input
            type="text"
            placeholder="What needs to be done?"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />

          <button type="submit">
            + Add Task
          </button>
        </form>

        {error && <p className="error">{error}</p>}

        <div className="todo-list">
          <div className="list-header">
            <h2>My Tasks</h2>

            <button
              className="refresh-btn"
              onClick={fetchTodos}
              type="button"
            >
              ↻ Refresh
            </button>
          </div>

          {loading ? (
            <p className="empty">Loading tasks...</p>
          ) : todos.length === 0 ? (
            <p className="empty">No tasks yet. Add your first task!</p>
          ) : (
            todos.map((todo) => (
              <div className="todo-item" key={todo.id}>
                <div className="todo-content">
                  <input
                    type="checkbox"
                    checked={Boolean(todo.completed)}
                    onChange={() => toggleTodo(todo)}
                  />

                  <span
                    className={
                      todo.completed ? "completed" : ""
                    }
                  >
                    {todo.title}
                  </span>
                </div>

                <button
                  className="delete-btn"
                  onClick={() => deleteTodo(todo.id)}
                >
                  Delete
                </button>
              </div>
            ))
          )}
        </div>

        <footer>
          React + Node.js + AWS RDS MySQL
        </footer>

      </div>
    </div>
  );
}

export default App;
