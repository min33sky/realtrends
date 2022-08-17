import fastifySwagger from '@fastify/swagger';
import Fastify from 'fastify';
import { swaggerConfig } from './config/swagger.js';
import AppError from './lib/AppError.js';
import routes from './routes/index.js';
import 'dotenv/config';

const server = Fastify({ logger: true });

await server.register(fastifySwagger, swaggerConfig);

server.setErrorHandler(async (error, request, reply) => {
  reply.statusCode = error.statusCode ?? 500;
  if (error instanceof AppError) {
    return {
      message: error.message,
      name: error.name,
      statusCode: error.statusCode,
    };
  }
  return error;
});

server.register(routes);

server.listen({ port: 4000 });
