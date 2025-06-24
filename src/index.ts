import { Elysia } from 'elysia';
import { jwt } from '@elysiajs/jwt';
import { cors } from '@elysiajs/cors';
import { appRouter } from './routers/router';

const app = new Elysia()

  // 1. Middlewares Globais
  .use(
    jwt({
      name: 'jwt',
      secret: process.env.JWT_SECRET!,
      exp: '7d',
    })
  )

  // 2. Acesso do sua API
  .use(cors({
    origin: [
        'http://localhost:3000',
        'https://meu-app-incrivel.com'
    ],
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'], 
  }))

  // 3. Monta todas as rotas da aplicação
  .use(appRouter)

  // 4. Inicia o servidor
  .listen(3000, (server) => {
    console.log(
      `🦊 Servidor Elysia rodando em http://${server.hostname}:${server.port}`
    );
  });