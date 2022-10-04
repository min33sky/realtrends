import { Token, User } from '@prisma/client';
import bcrypt from 'bcrypt';
import AppError, { isAppError } from '../lib/AppError.js';
import db from '../lib/db.js';
import NextAppError from '../lib/NextAppError.js';
import {
  generateToken,
  RefreshTokenPayload,
  validateToken,
} from '../lib/tokens.js';
import { validate } from '../lib/validate.js';

const SALT_ROUNDS = 10;

interface IAuthParams {
  username: string;
  password: string;
}

class UserService {
  private static instance: UserService;

  public static getInstance() {
    if (!UserService.instance) {
      UserService.instance = new UserService();
    }
    return UserService.instance;
  }

  async createToken(userId: number) {
    const token = await db.token.create({
      data: {
        userId,
      },
    });

    return token;
  }

  /**
   * 토큰 생성
   * @param user
   * @param tokenItem 기존 토큰
   */
  async generateToken(user: User, tokenItem?: Token) {
    const { id: userId, username } = user;

    const token = tokenItem ?? (await this.createToken(userId));
    const tokenId = token.id;

    const [accessToken, refreshToken] = await Promise.all([
      generateToken({
        type: 'access_token',
        tokenId,
        userId: userId,
        username: username,
      }),
      generateToken({
        type: 'refresh_token',
        tokenId,
        rotationCounter: token.rotationCounter,
      }),
    ]);

    return {
      refreshToken,
      accessToken,
    };
  }

  /**
   * 로그인
   * @param username
   * @param password
   */
  async login({ username, password }: IAuthParams) {
    const user = await db.user.findUnique({
      where: {
        username,
      },
    });

    if (!user) throw new AppError('AuthenticationError');

    try {
      const result = await bcrypt.compare(password, user.passwordHash);
      if (!result) throw new AppError('AuthenticationError');
    } catch (error) {
      if (isAppError(error)) throw error;
      throw new AppError('UnknownError');
    }

    //? 토큰 생성
    const tokens = await this.generateToken(user);

    return {
      user,
      tokens,
    };
  }

  /**
   * 회원 가입
   * @param username
   * @param password
   */
  async register({ username, password }: IAuthParams) {
    const exists = await db.user.findUnique({
      where: {
        username,
      },
    });

    if (exists) {
      throw new AppError('UserExistsError');
    }

    const hash = await bcrypt.hash(password, SALT_ROUNDS);
    const user = await db.user.create({
      data: {
        username,
        passwordHash: hash,
      },
    });

    const tokens = await this.generateToken(user);

    return {
      tokens,
      user,
    };
  }

  /**
   * 토큰 갱신
   * @param token refresh token
   */
  async refreshToken(token: string) {
    try {
      //* 토큰 유효성 검사
      const { tokenId, rotationCounter } =
        await validateToken<RefreshTokenPayload>(token);

      //* DB에서 토큰 조회
      const tokenItem = await db.token.findUnique({
        where: {
          id: tokenId,
        },
        include: {
          user: true,
        },
      });

      if (!tokenItem) throw new Error('Token not found');

      if (tokenItem.blocked) {
        throw new Error('Token is blocked');
      }

      //? 서버와 현재 토큰의 rotationCounter 값이 다를 경우 현재 토큰을 Block 처리 후 에러 발생
      if (tokenItem.rotationCounter !== rotationCounter) {
        await db.token.update({
          where: {
            id: tokenId,
          },
          data: {
            blocked: true,
          },
        });
        throw new Error('Rotation Counter is not matched');
      }

      tokenItem.rotationCounter += 1;

      await db.token.update({
        where: {
          id: tokenItem.id,
        },
        data: {
          rotationCounter: tokenItem.rotationCounter,
        },
      });

      //* 토큰 갱신
      return this.generateToken(tokenItem.user, tokenItem);
    } catch (error) {
      throw new AppError('RefreshTokenError');
    }
  }

  async changePassword({
    newPassword,
    oldPassword,
    userId,
  }: {
    oldPassword: string;
    newPassword: string;
    userId: number;
  }) {
    const user = await db.user.findUnique({
      where: {
        id: userId,
      },
    });

    if (!validate.password(newPassword)) {
      throw new NextAppError('BadRequest', { message: 'Password is invalid' });
    }

    try {
      if (!user) {
        throw new Error();
      }

      const result = await bcrypt.compare(oldPassword, user.passwordHash);

      if (!result) {
        throw new Error();
      }
    } catch (error) {
      throw new NextAppError('Forbidden', {
        message: 'Password does not match',
      });
    }

    const passwordHash = await bcrypt.hash(newPassword, SALT_ROUNDS);
    await db.user.update({
      where: {
        id: userId,
      },
      data: {
        passwordHash,
      },
    });

    return true;
  }

  unregister(userId: number) {
    return db.user.delete({
      where: {
        id: userId,
      },
    });
  }
}

export default UserService;
