/**
 * Representa a estrutura de um usuário conforme armazenado no banco de dados.
 * Ideal para tipar objetos recebidos do Drizzle ORM.
 */
export interface User {
  id: number;
  username: string;
  email: string;
  password: string;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Representa os dados necessários para CRIAR um novo usuário.
 * Geralmente, o ID e timestamps são gerados automaticamente pelo banco de dados.
 * A senha deve ser recebida em texto puro e hasheada antes de salvar.
 */
export interface NewUserPayload {
  username: string;
  email: string;
  password: string;
}


/**
 * Representa os dados para LOGIN de um usuário.
 * Normalmente, requer apenas o identificador (email/username) e a senha em texto puro.
 */
export interface UserLoginPayload {
  identifier: string; // Pode ser email ou username
  password: string;
}