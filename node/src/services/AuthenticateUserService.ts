import axios from 'axios';
import { prismaClient } from '../prisma';
import { sign } from 'jsonwebtoken';

/**
 * Receber code
 * Recuperar o access_token
 * Recuperar info do usuário do github
 * Verificar se o usuário existe no DB
 * Se existir - gerar um token
 * Se Não - criar no DB e gerar token
 * Retorna p token do usuário
 */

type AccessTokenResponse = {
  access_token: string;
};

type UserResponse = {
  id: number;
  name: string;
  login: string;
  avatar_url: string;
};

export class AuthenticatUserService {
  async execute(code: string) {
    const url = 'https://github.com/login/oauth/access_token';

    const { data: acessTokenResponse } = await axios.post<AccessTokenResponse>(
      url,
      null,
      {
        params: {
          client_id: process.env.GITHUB_CLIENT_ID,
          client_secret: process.env.GITHUB_CLIENT_SECRET,
          code,
        },
        headers: {
          Accept: 'application/json',
        },
      },
    );

    const response = await axios.get<UserResponse>(
      'https://api.github.com/user',
      {
        headers: {
          authorization: `Bearer ${acessTokenResponse.access_token}`,
        },
      },
    );

    const { id, name, login, avatar_url } = response.data;

    let user = await prismaClient.user.findFirst({
      where: {
        github_id: id,
      },
    });

    if (!user) {
      user = await prismaClient.user.create({
        data: {
          name,
          github_id: id,
          login,
          avatar_url,
        },
      });
    }

    const token = sign(
      {
        user: {
          id: user.id,
          name: user.name,
          avatar_url: user.avatar_url,
        },
      },
      process.env.JWT_SECRET,
      { subject: user.id, expiresIn: '1d' },
    );

    return { token, user };
  }
}
