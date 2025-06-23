import {
  mysqlTable,
  serial,
  varchar,
  timestamp,
} from 'drizzle-orm/mysql-core';

// Define a tabela 'User' no banco de dados.
export const users = mysqlTable('User', {
  id: serial('id').primaryKey(), // 'id' (INT AUTO_INCREMENT PRIMARY KEY)
  username: varchar('username', { length: 255 }).unique().notNull(), // 'username' (VARCHAR(255) UNIQUE NOT NULL)
  email: varchar('email', { length: 255 }).unique().notNull(),     // 'email' (VARCHAR(255) UNIQUE NOT NULL)
  password: varchar('password', { length: 255 }).notNull(),       // 'password' (VARCHAR(255) NOT NULL - armazenará o hash da senha)
  createdAt: timestamp('createdAt').defaultNow().notNull(),      // 'createdAt' (DATETIME DEFAULT CURRENT_TIMESTAMP NOT NULL)
  updatedAt: timestamp('updatedAt').defaultNow().onUpdateNow().notNull(), // 'updatedAt' (DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP NOT NULL)
});


/**
 * Tipo para dados de um NOVO usuário a ser inserido no banco de dados.
 * Não inclui campos como 'id', 'createdAt', 'updatedAt' que são gerados automaticamente.
 */
export type NewUserDB = typeof users.$inferInsert;

/**
 * Tipo para um usuário SELECIONADO (lido) do banco de dados.
 * Inclui todos os campos da tabela.
 */
export type SelectUserDB = typeof users.$inferSelect;