import Database from 'better-sqlite3';
import * as path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const dbPath = path.resolve(__dirname, 'app.db');
const db = new Database(dbPath);

console.log('ADDING DB');

// Create table if it doesn't exist
db.prepare(`
  CREATE TABLE IF NOT EXISTS notes (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    content TEXT NOT NULL
  )
`).run();

const insertNote = (content: string) => {
  const stmt = db.prepare('INSERT INTO notes (content) VALUES (?)');
  const info = stmt.run(content);
  return info.lastInsertRowid;
};

const getAllNotes = () => {
  const stmt = db.prepare('SELECT * FROM notes');
  return stmt.all();
};

export {
  getAllNotes, insertNote
};
