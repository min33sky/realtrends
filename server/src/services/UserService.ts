import bcrypt from 'bcrypt';
import AppError from '../lib/AppError.js';
import db from '../lib/db.js';

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
    return user;
  }
}

export default UserService;
