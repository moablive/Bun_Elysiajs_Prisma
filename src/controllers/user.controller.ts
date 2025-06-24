import type { ElysiaContext } from '../types/elysia-context';
import { userService } from '../Services/user.service';

async function register({ body, set }: ElysiaContext) {
  try {
    const user = await userService.createUser(body!);
    set.status = 201;
    return { message: 'Usuário criado com sucesso!', user };
  } catch (error: any) {
    if (error?.code === 'P2002') {
      set.status = 409;
      return { error: 'Username ou Email já está em uso.' };
    }
    console.error(error);
    set.status = 500;
    return { error: 'Ocorreu um erro inesperado no servidor.' };
  }
}

async function login({ body, jwt, set }: ElysiaContext) {
  const user = await userService.findUserByEmailForAuth(body!.email);
  if (!user) {
    set.status = 401;
    return { error: 'Credenciais inválidas.' };
  }

  const isPasswordCorrect = await Bun.password.verify(body!.password, user.password);
  if (!isPasswordCorrect) {
    set.status = 401;
    return { error: 'Credenciais inválidas.' };
  }

  const token = await jwt.sign({ sub: user.id, username: user.username });
  return { message: 'Login bem-sucedido!', token };
}

async function getProfile({ jwt, set, headers }: ElysiaContext) {
  const token = headers.authorization?.split(' ')[1];
  if (!token) {
    set.status = 401;
    return { error: 'Token não fornecido' };
  }

  const payload = await jwt.verify(token);
  if (!payload) {
    set.status = 401;
    return { error: 'Token inválido ou expirado.' };
  }

  const userProfile = await userService.findUserForProfile(Number(payload.sub));
  if (!userProfile) {
    set.status = 404;
    return { error: 'Usuário não encontrado.' };
  }
  return userProfile;
}

export const userController = {
  register,
  login,
  getProfile,
};