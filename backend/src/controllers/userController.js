import { z } from 'zod';
import { userService, AppError } from '../services/userService.js';

const createUserSchema = z.object({
  name: z
    .string({ required_error: 'O nome é obrigatório.' })
    .trim()
    .min(3, 'O nome deve conter no mínimo 3 caracteres válidos.'),
  email: z
    .string({ required_error: 'O e-mail é obrigatório.' })
    .trim()
    .email('Formato de e-mail inválido.'),
  login: z
    .string({ required_error: 'O login é obrigatório.' })
    .trim()
    .min(3, 'O login deve conter no mínimo 3 caracteres.'),
  password: z
    .string({ required_error: 'A senha é obrigatória.' })
    .min(8, 'Senha com mínimo de 8 caracteres, contendo pelo menos uma letra maiúscula e minúscula e um número.')
    .regex(/[a-z]/, 'Senha com mínimo de 8 caracteres, contendo pelo menos uma letra maiúscula e minúscula e um número.')
    .regex(/[A-Z]/, 'Senha com mínimo de 8 caracteres, contendo pelo menos uma letra maiúscula e minúscula e um número.')
    .regex(/[0-9]/, 'Senha com mínimo de 8 caracteres, contendo pelo menos uma letra maiúscula e minúscula e um número.'),
  active: z.boolean().optional(),
});

// Na edição, todos os campos são opcionais, mas se enviados devem respeitar as regras
const updateUserSchema = z.object({
  name: z
    .string()
    .trim()
    .min(3, 'O nome deve conter no mínimo 3 caracteres válidos.')
    .optional(),
  email: z
    .string()
    .trim()
    .email('Formato de e-mail inválido.')
    .optional(),
  login: z
    .string()
    .trim()
    .min(3, 'O login deve conter no mínimo 3 caracteres.')
    .optional(),
  password: z
    .string()
    .min(8, 'Mínimo de 8 caracteres, contendo pelo menos uma letra maiúscula e minúscula e um número.')
    .regex(/[a-z]/, 'Mínimo de 8 caracteres, contendo pelo menos uma letra maiúscula e minúscula e um número.')
    .regex(/[A-Z]/, 'Mínimo de 8 caracteres, contendo pelo menos uma letra maiúscula e minúscula e um número.')
    .regex(/[0-9]/, 'Mínimo de 8 caracteres, contendo pelo menos uma letra maiúscula e minúscula e um número.')
    .optional(),
  active: z.boolean().optional(),
});

function handleError(res, error) {
  if (error instanceof z.ZodError) {
    const firstMessage = error.issues[0]?.message || 'Dados inválidos.';
    return res.status(400).json({
      error: firstMessage,
      details: error.issues.map((i) => ({ field: i.path.join('.'), message: i.message })),
    });
  }

  if (error instanceof AppError) {
    return res.status(error.statusCode).json({ error: error.message });
  }

  console.error(error);
  return res.status(500).json({ error: 'Erro interno do servidor.' });
}

export const userController = {
  getAll(req, res) {
    try {
      const users = userService.listUsers();
      return res.status(200).json(users);
    } catch (error) {
      return handleError(res, error);
    }
  },

  getById(req, res) {
    try {
      const id = Number(req.params.id);
      if (Number.isNaN(id)) {
        return res.status(400).json({ error: 'ID inválido.' });
      }
      const user = userService.getUserById(id);
      return res.status(200).json(user);
    } catch (error) {
      return handleError(res, error);
    }
  },

  getByNameEmailLogin(req, res) {
    try {
        const { term } = req.params;
        if (!term || term.trim() === '' ) {
            return res.status(400).json({ error: 'Digite o nome, e-mail ou login.' });
        }
        const user = userService.getUserByNameEmailLogin(term);
        return res.status(200).json(user);
    } catch (error) {
        return handleError(res, error);
    }
  },

  async create(req, res) {
    try {
      const validatedData = createUserSchema.parse(req.body);
      const newUser = await userService.createUser(validatedData);
      return res.status(201).json(newUser);
    } catch (error) {
      return handleError(res, error);
    }
  },

  async update(req, res) {
    try {
      const id = Number(req.params.id);
      if (Number.isNaN(id)) {
        return res.status(400).json({ error: 'ID inválido.' });
      }
      const validatedData = updateUserSchema.parse(req.body);
      const updatedUser = await userService.updateUser(id, validatedData);
      return res.status(200).json(updatedUser);
    } catch (error) {
      return handleError(res, error);
    }
  },

  delete(req, res) {
    try {
      const id = Number(req.params.id);
      if (Number.isNaN(id)) {
        return res.status(400).json({ error: 'ID inválido.' });
      }
      userService.deleteUser(id);
      return res.status(204).send();
    } catch (error) {
      return handleError(res, error);
    }
  },
};