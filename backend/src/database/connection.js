import Database from 'better-sqlite3';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Cria o arquivo database.sqlite na raiz da pasta backend
const dbPath = path.resolve(__dirname, '../../database.sqlite');
const db = new Database(dbPath);

// Cria a tabela de usuários caso ainda não exista
db.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    email TEXT NOT NULL UNIQUE,
    login TEXT NOT NULL UNIQUE,
    password_hash TEXT NOT NULL,
    active INTEGER NOT NULL DEFAULT 1
  )
`);

export default db;