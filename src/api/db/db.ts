import 'dotenv/config';
import { drizzle } from 'drizzle-orm/mysql2';
import mysql from 'mysql2/promise';
import * as schema from './schema';

// Verifica se a DATABASE_URL está definida
if (!process.env.DATABASE_URL) {
  throw new Error('DATABASE_URL is not set in the .env file');
}

// Cria um pool de conexões com o banco de dados
const poolConnection = mysql.createPool({
  uri: process.env.DATABASE_URL,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// Instancia o Drizzle ORM
export const db = drizzle(poolConnection, { schema: schema });

// Exporta também as definições de esquema para facilitar a importação em outros arquivos
export * from './schema';