import bcrypt from 'bcryptjs';
import { userRepository } from '../repositories/userRepository.js';

// Classe auxiliar para diferenciar erros de regra de negócio (400/404) de falhas internas (500)
export class AppError extends Error {
  constructor(message, statusCode = 400) {
    super(message);
    this.statusCode = statusCode;
  }
}

// Formata o registro vindo do SQLite (converte active 1/0 para booleano e garante ausência de senha)
function formatUser(user) {
  if (!user) return null;
  const { password_hash, ...safeUser } = user;
  return {
    ...safeUser,
    active: Boolean(safeUser.active),
  };
}

export const userService = {
  listUsers() {
    const users = userRepository.findAll();
    return users.map(formatUser);
  },

  getUserByNameEmailLogin(nameEmailLogin) {
    const user =userRepository.getUserByNameEmailLogin(nameEmailLogin.trim());
    if (!user) {
      throw new AppError('Usuário não encontrado.', 404);
    }
    return user.map(formatUser);
  },

  getUserById(id) {
    const user = userRepository.findById(id);
    if (!user) {
      throw new AppError('Usuário não encontrado.', 404);
    }
    return formatUser(user);
  },

  async createUser({ name, email, login, password, active }) {
    const cleanName = name.trim();
    const cleanEmail = email.trim().toLowerCase();
    const cleanLogin = login.trim();

    if (userRepository.findByEmail(cleanEmail)) {
      throw new AppError('Este e-mail já está cadastrado no sistema.', 400);
    }

    if (userRepository.findByLogin(cleanLogin)) {
      throw new AppError('Este login já está em uso.', 400);
    }

    const password_hash = await bcrypt.hash(password, 10);

    const created = userRepository.create({
      name: cleanName,
      email: cleanEmail,
      login: cleanLogin,
      password_hash,
      active: active !== undefined ? active : true,
    });

    return formatUser(created);
  },

  async updateUser(id, { name, email, login, password, active }) {
    const existingUser = userRepository.findById(id);
    if (!existingUser) {
      throw new AppError('Usuário não encontrado.', 404);
    }

    const updates = {};

    if (name !== undefined) {
      updates.name = name.trim();
    }

    if (email !== undefined) {
      const cleanEmail = email.trim().toLowerCase();
      const emailOwner = userRepository.findByEmail(cleanEmail);
      if (emailOwner && emailOwner.id !== Number(id)) {
        throw new AppError('Este e-mail já está sendo utilizado por outro usuário.', 400);
      }
      updates.email = cleanEmail;
    }

    if (login !== undefined) {
      const cleanLogin = login.trim();
      const loginOwner = userRepository.findByLogin(cleanLogin);
      if (loginOwner && loginOwner.id !== Number(id)) {
        throw new AppError('Este login já está sendo utilizado por outro usuário.', 400);
      }
      updates.login = cleanLogin;
    }

    if (password !== undefined && password !== '') {
      updates.password_hash = await bcrypt.hash(password, 10);
    }

    if (active !== undefined) {
      updates.active = active;
    }

    const updated = userRepository.update(id, updates);
    return formatUser(updated);
  },

  deleteUser(id) {
    const existingUser = userRepository.findById(id);
    if (!existingUser) {
      throw new AppError('Usuário não encontrado.', 404);
    }

    userRepository.delete(id);
  },
};