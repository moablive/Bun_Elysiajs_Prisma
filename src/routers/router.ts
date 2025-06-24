import { Elysia } from 'elysia';
import { userRoutes } from './user.router';

const appRouter = new Elysia()
    .use(userRoutes);

export { appRouter };