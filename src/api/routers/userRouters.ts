import { Elysia, t } from 'elysia'; // Elysia 
import { eq } from 'drizzle-orm'; // Drizzle ORM 

import { users, SelectUserDB, NewUserDB } from '../db/schema';
import { NewUserPayload, UserLoginPayload } from '../interfaces/user';
import * as bcrypt from 'bcryptjs';


export const userRoutes = new Elysia({ prefix: '/users' })

  // Define a rota POST para registro de novos usuários
  .post('/register', async ({ body, db, set }) => {
    // Valida o corpo da requisição usando a interface NewUserPayload
    const { username, email, password } = body as NewUserPayload;

    // --- Validação Básica de Entrada ---
    if (!username || !email || !password) {
      set.status = 400; // Bad Request
      return { success: false, message: 'Todos os campos (username, email, password) são obrigatórios.' };
    }

    // --- Verificação de Usuário Existente ---
    // Tenta encontrar um usuário com o mesmo email ou username
    const existingUsers = await db.select()
      .from(users)
      .where(eq(users.email, email) || eq(users.username, username))
      .limit(1)
      .execute();

    if (existingUsers.length > 0) {
      set.status = 409; // Conflict
      if (existingUsers[0].email === email) {
        return { success: false, message: 'Email já cadastrado.' };
      }
      return { success: false, message: 'Nome de usuário já existe.' };
    }

    // --- Hash da Senha ---
    // Gera um hash seguro da senha antes de armazenar no banco de dados
    const hashedPassword = await bcrypt.hash(password, 10); // '10' é o saltRounds (complexidade do hash)

    // --- Criação do Usuário no Banco de Dados ---
    try {
      const newUserArray: SelectUserDB[] = await db.insert(users).values({
        username,
        email,
        password: hashedPassword, // Armazena a senha hasheada
      }).returning().execute(); // Retorna o usuário criado do banco de dados

      const newUser = newUserArray[0];

      // Remove a senha do objeto antes de retornar ao cliente por segurança
      const userResponse: Omit<SelectUserDB, 'password'> = {
        id: newUser.id,
        username: newUser.username,
        email: newUser.email,
        createdAt: newUser.createdAt,
        updatedAt: newUser.updatedAt,
      };

      set.status = 201; // Created
      return { success: true, message: 'Usuário registrado com sucesso!', user: userResponse };
    } catch (error) {
      console.error('Erro ao registrar usuário:', error);
      set.status = 500; // Internal Server Error
      return { success: false, message: 'Erro interno ao registrar usuário.' };
    }
  })

  // Define a rota POST para login de usuários
  .post('/login', async ({ body, db, set }) => {
    // Valida o corpo da requisição usando a interface UserLoginPayload
    const { identifier, password } = body as UserLoginPayload;

    // --- Validação Básica de Entrada ---
    if (!identifier || !password) {
      set.status = 400; // Bad Request
      return { success: false, message: 'Identificador (email/username) e senha são obrigatórios.' };
    }

    // --- Busca do Usuário ---
    // Tenta encontrar o usuário pelo email OU username
    const userResult = await db.select()
      .from(users)
      .where(eq(users.email, identifier) || eq(users.username, identifier))
      .limit(1)
      .execute();

    if (userResult.length === 0) {
      set.status = 401; // Unauthorized
      return { success: false, message: 'Credenciais inválidas.' };
    }

    const foundUser = userResult[0];

    // --- Verificação da Senha ---
    // Compara a senha fornecida com o hash armazenado no banco de dados
    const passwordMatch = await bcrypt.compare(password, foundUser.password);

    if (!passwordMatch) {
      set.status = 401; // Unauthorized
      return { success: false, message: 'Credenciais inválidas.' };
    }

    // --- Login Bem-Sucedido ---
    // Remove a senha do objeto antes de retornar ao cliente por segurança
    const userResponse: Omit<SelectUserDB, 'password'> = {
      id: foundUser.id,
      username: foundUser.username,
      email: foundUser.email,
      createdAt: foundUser.createdAt,
      updatedAt: foundUser.updatedAt,
    };

    set.status = 200; // OK
    return { success: true, message: 'Login bem-sucedido!', user: userResponse };
  });