// src/routers.ts
import { Elysia } from 'elysia';
import { db } from '../db/db';
import { userRoutes } from './userRouters';

export const router = new Elysia({ prefix: '/api' }).decorate('db', db).use(userRoutes); 