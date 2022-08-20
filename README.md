# Realtrends

## Getting Started

## Stacks

### Frontend

- react
- remix
- tailwindcss

### Backend

- fastify
- prisma
- posgresql

## Coding Note

1. Backend의 Module을 `CommonJS`가 아닌 `ESM`을 채택

- Node에서 ESM을 사용하기 위한 설정

```json
// package.json에 다음 코드 추가
...
"type": "module",
...
```

```json
// tsconfig.json
{
  "compilerOptions": {
    "target": "ES2022",
    "module": "ES2022",
    "lib": ["ESNext"],
    "rootDir": "./src",
    "moduleResolution": "node",
    "outDir": "./dist",
    "forceConsistentCasingInFileNames": true,
    "strict": true,
    "skipLibCheck": true,
    "allowSyntheticDefaultImports": true,
    "esModuleInterop": true,
    "sourceMap": true
  }
}
```

2. ESM을 사용할 때 Import시 발생하는 문제 해경하기
   - ESM에서는 모듈을 Import할 때 디렉토리나 index로 끝나는 Import를 지원하지 않는다. 끝에 `.js`를 붙여주면 해결이 된다.
   - node를 실행할 때 다음 Flag를 추가하면 해결이 된다. (**--experimental-specifier-resolution=node**)

```bash
node --experimental-specifier-resolution=node file.js
```

3. 특정 Endpoint에만 Plugin 적용하기

```ts
const authRoute: FastifyPluginAsync = async (fastify) => {
  const userService = UserService.getInstance();

  //? 특정 Endpoint만 plugin 적용
  fastify.register(async (_fastify, opts) => {
    _fastify.register(requireAuthPlugin);
    _fastify.get('/test', async (request, reply) => {
      return {
        message: 'Hello World!',
      };
    });
  });
...
```

## Reference

- ESM을 사용할 때 Import 문제 [[Link]](https://bobbyhadz.com/blog/node-js-error-err-unsupported-dir-import)
