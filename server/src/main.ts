import fastifySwagger from '@fastify/swagger';
import Fastify from 'fastify';
import { swaggerConfig } from './config/swagger.js';
import routes from './routes/index.js';

const server = Fastify({ logger: true });

server.get('/ping', async () => {
  return 'pooooog';
});

await server.register(fastifySwagger, swaggerConfig);
server.register(routes);

server.listen({ port: 4000 });
