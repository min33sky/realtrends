import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET ?? 'DevSecretKey';

export const tokenDuration = {
  access_token: '1h',
  refresh_token: '30d',
} as const;

if (process.env.JWT_SECRET === undefined) {
  console.warn('JWT_SECRET is not defined in .env file');
}

export function generateToken(payload: TokenPayload) {
  return new Promise<string>((resolve, reject) => {
    jwt.sign(
      payload,
      JWT_SECRET,
      { expiresIn: tokenDuration[payload.type] },
      (err, token) => {
        if (err || !token) {
          reject(err);
          return;
        } else {
          resolve(token);
        }
      },
    );
  });
}

export function validateToken<T extends TokenPayload>(token: string) {
  return new Promise<DecodedToken<T>>((resolve, reject) => {
    jwt.verify(token, JWT_SECRET, (err, decoded) => {
      if (err) {
        reject(err);
        return;
      } else {
        resolve(decoded as DecodedToken<T>);
      }
    });
  });
}

export interface AccessTokenPayload {
  type: 'access_token';
  tokenId: number;
  userId: number;
  username: string;
}

export interface RefreshTokenPayload {
  type: 'refresh_token';
  tokenId: number;
  rotationCounter: number; //? 새로고침시 카운트 증가 (서버와 횟수가 일치해야 유효토큰)
}

type TokenPayload = AccessTokenPayload | RefreshTokenPayload;

type DecodedToken<T> = {
  iat: number;
  exp: number;
} & T;
