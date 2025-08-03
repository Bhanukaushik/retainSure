const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('users.db');

db.serialize(() => {
  db.run(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      email TEXT NOT NULL UNIQUE,
      password TEXT NOT NULL
    )
  `);

  const insert = db.prepare("INSERT INTO users (name, email, password) VALUES (?, ?, ?)");

  insert.run("John Doe", "john@example.com", "password123");
  insert.run("Jane Smith", "jane@example.com", "secret456");
  insert.run("Bob Johnson", "bob@example.com", "qwerty789");

  insert.finalize();
});

db.close();
