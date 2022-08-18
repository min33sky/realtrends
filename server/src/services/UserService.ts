import { User } from '@prisma/client';
import bcrypt from 'bcrypt';
import AppError, { isAppError } from '../lib/AppError.js';
import db from '../lib/db.js';
import { generateToken } from '../lib/tokens.js';

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

  /**
   * 인증 토큰 생성
   * @param user
   */
  async generateToken(user: User) {
    const [accessToken, refreshToken] = await Promise.all([
      generateToken({
        type: 'access_token',
        tokenId: 1,
        userId: user.id,
        username: user.username,
      }),
      generateToken({
        type: 'refresh_token',
        tokenId: 1,
        rotationCounter: 1,
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

    if (!user) {
      throw new AppError('AuthenticationError');
    }

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
}

export default UserService;
