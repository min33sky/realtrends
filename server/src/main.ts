import fastifySwagger from '@fastify/swagger';
import Fastify from 'fastify';
import { swaggerConfig } from './config/swagger';
import AppError from './lib/AppError';
import routes from './routes';
import 'dotenv/config';
import { authPlugin } from './plugins/authPlugin';
import fastifyCookie from '@fastify/cookie';
import cors from '@fastify/cors';

const server = Fastify({ logger: true });

if (process.env.NODE_ENV === 'development') {
  server.register(cors, {
    origin: /localhost/,
    allowedHeaders: ['Cookie', 'Content-Type'],
    credentials: true,
  });
}

await server.register(fastifySwagger, swaggerConfig);

server.register(fastifyCookie);

server.setErrorHandler(async (error, request, reply) => {
  reply.statusCode = error.statusCode ?? 500;
  if (error instanceof AppError) {
    return {
      statusCode: error.statusCode,
      name: error.name,
      message: error.message,
      payload: error.payload,
    };
  }
  return error;
});

server.register(authPlugin);
server.register(routes);

server.listen({ port: 4000 });
