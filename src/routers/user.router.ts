import { Elysia, t } from 'elysia';
import { userController } from '../controllers/user.controller';

const userValidationSchemas = {
  register: {
    body: t.Object({
      username: t.String(),
      email: t.String({ format: 'email' }),
      password: t.String({ minLength: 8 }),
    }),
  },
  login: {
    body: t.Object({
      email: t.String({ format: 'email' }),
      password: t.String(),
    }),
  },
};

export const userRoutes = new Elysia({ prefix: '/users' })
  .post('/register', userController.register, userValidationSchemas.register)
  .post('/login', userController.login, userValidationSchemas.login)
  .get('/profile', userController.getProfile);