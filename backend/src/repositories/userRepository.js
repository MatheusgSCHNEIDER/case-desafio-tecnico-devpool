import db from '../database/connection.js';

export const userRepository = {
  findAll() {
    return db.prepare('SELECT id, name, email, login, active FROM users').all();
  },

  getUserByNameEmailLogin(term){
    const pattern = `%${term}%`;
    return db.prepare('SELECT id, name, email, login, active FROM users WHERE name like ? or email like ? or login like ?').all(pattern, pattern, pattern);
  },

  findById(id) {
    return db.prepare('SELECT id, name, email, login, active FROM users WHERE id = ?').get(id);
  },

  findByEmail(email) {
    return db.prepare('SELECT id FROM users WHERE email = ?').get(email);
 },

 findByLogin(login) {
    return db.prepare('SELECT id FROM users WHERE login = ?').get(login);
 },

  create({ name, email, login, password_hash, active }) {
    const stmt = db.prepare(`
      INSERT INTO users (name, email, login, password_hash, active)
      VALUES (?, ?, ?, ?, ?)
    `);
    const result = stmt.run(name, email, login, password_hash, active ? 1 : 0);
    return this.findById(result.lastInsertRowid);
  },

  update(id, fields) {
    const columns = [];
    const values = [];

    if (fields.name !== undefined) {
      columns.push('name = ?');
      values.push(fields.name);
    }
    if (fields.email !== undefined) {
      columns.push('email = ?');
      values.push(fields.email);
    }
    if (fields.login !== undefined) {
      columns.push('login = ?');
      values.push(fields.login);
    }
    if (fields.password_hash !== undefined) {
      columns.push('password_hash = ?');
      values.push(fields.password_hash);
    }
    if (fields.active !== undefined) {
      columns.push('active = ?');
      values.push(fields.active ? 1 : 0);
    }

    if (columns.length === 0) return this.findById(id);

    values.push(id);
    db.prepare(`UPDATE users SET ${columns.join(', ')} WHERE id = ?`).run(...values);
    return this.findById(id);
  },

  delete(id) {
    const result = db.prepare('DELETE FROM users WHERE id = ?').run(id);
    return result.changes > 0;
  }
};