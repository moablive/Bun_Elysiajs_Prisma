// src/index.ts
import { Elysia } from 'elysia';
import { router } from './routers/routers';

// Cria a instância principal do Elysia.
const app = new Elysia()
  .get('/', () => 'API de Autenticação - Drizzle/Elysia/Bun')
  .use(router)
  .listen(3000, () => {
    console.log(`🦊 Elysia está rodando em http://localhost:${app.server?.port}`);
    console.log('Rotas disponíveis:');
    console.log(' - GET /');
    console.log(' - POST /api/users/register');
    console.log(' - POST /api/users/login');
  });
