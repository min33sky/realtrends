import bcrypt from 'bcrypt';
import AppError from '../lib/AppError.js';
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

  async generateToken(userId: number, username: string) {
    const [accessToken, refreshToken] = await Promise.all([
      generateToken({
        type: 'access_token',
        tokenId: 1,
        userId,
        username,
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

  login({ username, password }: IAuthParams) {
    return 'Loged In!';
  }

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

    const tokens = await this.generateToken(user.id, username);

    return {
      tokens,
      user,
    };
  }
}

export default UserService;
