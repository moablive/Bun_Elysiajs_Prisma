import { PrismaClient, type User } from '@prisma/client'; 
import type { UserPublic } from '../interfaces/user.interface';

/**
 * 1. Instancia o PrismaClient.
 */
const db = new PrismaClient();

/** 
 * 2. Define um tipo para os dados 
 * necessários para criar um usuário.
 * */ 
type UserCreationData = Omit<User, 'id' | 'createdAt' | 'updatedAt'>;

/**
 * Cria um novo utilizador na base de dados.
 * É responsável por receber a senha em texto puro, fazer o hash e guardar.
 *
 * @param userData - Os dados do utilizador para criar (username, email, password).
 * @returns O objeto do utilizador público recém-criado (sem a senha).
 * @throws Lança um erro se a senha não for fornecida.
 */
async function createUser(userData: UserCreationData): Promise<UserPublic> {
  // Validação para garantir que a senha existe antes de fazer o hash.
  if (!userData.password) {
    throw new Error('A senha é um campo obrigatório para criar um utilizador.');
  }

  // Faz o hash da senha usando o algoritmo seguro e rápido do Bun.
  const hashedPassword = await Bun.password.hash(userData.password);

  // Cria o registo na base de dados usando o Prisma.
  const newUser = await db.user.create({
    data: {
      username: userData.username,
      email: userData.email,
      password: hashedPassword, // Guarda a senha já "hasheada"
    },
    // Usa a cláusula 'select' para retornar apenas os campos públicos.
    // Isso garante que a senha nunca saia desta função.
    select: {
      id: true,
      username: true,
      email: true,
      createdAt: true,
    },
  });

  return newUser;
}

/**
 * Procura um utilizador pelo seu email para fins de autenticação.
 * Esta função é a única que deve retornar o objeto completo do utilizador,
 * incluindo a senha "hasheada", para que o controlador possa verificá-la.
 *
 * @param email - O email do utilizador a ser procurado.
 * @returns O objeto completo do utilizador (incluindo senha) ou null se não for encontrado.
 */
async function findUserByEmailForAuth(email: string): Promise<User | null> {
  return db.user.findUnique({
    where: { email },
  });
}

/**
 * Procura o perfil público de um utilizador pelo seu ID.
 * Usado para obter dados para exibir ao cliente após o login.
 *
 * @param id - O ID numérico do utilizador.
 * @returns O objeto de perfil público do utilizador ou null se não for encontrado.
 */
async function findUserForProfile(id: number): Promise<UserPublic | null> {
  return db.user.findUnique({
    where: { id },
    // Novamente, selecionamos apenas os campos seguros para retornar.
    select: {
      id: true,
      username: true,
      email: true,
      createdAt: true,
    },
  });
}

/**
 * 3. Exporta todas as funções 
 * como um único objeto 'userService'.
 */
export const userService = {
  createUser,
  findUserByEmailForAuth,
  findUserForProfile,
};