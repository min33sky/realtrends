# Realtrends

## Getting Started

## Stacks

### Frontend

- react

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
