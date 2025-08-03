const sqlite3 = require('sqlite3').verbose();
const bcrypt = require('bcrypt');
const db = new sqlite3.Database('users.db');

// Health check
exports.healthCheck = (req, res) => {
  res.send("User Management System (Node.js)");
};

// Get all users
exports.getAllUsers = (req, res) => {
  db.all("SELECT id, name, email FROM users", [], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
};

// Get user by ID
exports.getUserById = (req, res) => {
  const id = req.params.id;
  db.get("SELECT id, name, email FROM users WHERE id = ?", [id], (err, row) => {
    if (err) return res.status(500).json({ error: err.message });
    if (!row) return res.status(404).json({ error: "User not found" });
    res.json(row);
  });
};

// Create user
exports.createUser = async (req, res) => {
  const { name, email, password } = req.body;
  if (!name || !email || !password)
    return res.status(400).json({ error: "All fields are required" });

  const hashedPassword = await bcrypt.hash(password, 10);
  db.run(
    "INSERT INTO users (name, email, password) VALUES (?, ?, ?)",
    [name, email, hashedPassword],
    function (err) {
      if (err) return res.status(500).json({ error: err.message });
      res.status(201).json({ message: "User created", user_id: this.lastID });
    }
  );
};

// Update user
exports.updateUser = (req, res) => {
  const id = req.params.id;
  const { name, email } = req.body;
  if (!name || !email)
    return res.status(400).json({ error: "Name and email are required" });

  db.run(
    "UPDATE users SET name = ?, email = ? WHERE id = ?",
    [name, email, id],
    function (err) {
      if (err) return res.status(500).json({ error: err.message });
      if (this.changes === 0)
        return res.status(404).json({ error: "User not found" });
      res.json({ message: "User updated" });
    }
  );
};

// Delete user
exports.deleteUser = (req, res) => {
  const id = req.params.id;
  db.run("DELETE FROM users WHERE id = ?", [id], function (err) {
    if (err) return res.status(500).json({ error: err.message });
    if (this.changes === 0)
      return res.status(404).json({ error: "User not found" });
    res.json({ message: "User deleted" });
  });
};

// Search users by name
exports.searchUsers = (req, res) => {
  const name = req.query.name;
  if (!name) return res.status(400).json({ error: "Name query required" });

  db.all(
    "SELECT id, name, email FROM users WHERE name LIKE ?",
    [`%${name}%`],
    (err, rows) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json(rows);
    }
  );
};

// Login
exports.loginUser = (req, res) => {
  const { email, password } = req.body;
  if (!email || !password)
    return res.status(400).json({ error: "Email and password required" });

  db.get("SELECT * FROM users WHERE email = ?", [email], async (err, user) => {
    if (err) return res.status(500).json({ error: err.message });
    if (!user) return res.status(401).json({ status: "failed", error: "Invalid email or password" });

    const match = await bcrypt.compare(password, user.password);
    if (match) {
      res.json({ status: "success", user_id: user.id });
    } else {
      res.status(401).json({ status: "failed", error: "Invalid email or password" });
    }
  });
};
