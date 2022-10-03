import { TypeBoxTypeProvider } from '@fastify/type-provider-typebox';
import {
  FastifyBaseLogger,
  FastifyInstance,
  FastifyPluginOptions,
  RawReplyDefaultExpression,
  RawRequestDefaultExpression,
  RawServerDefault,
} from 'fastify';

type FastifyTypeBox = FastifyInstance<
  RawServerDefault,
  RawRequestDefaultExpression<RawServerDefault>,
  RawReplyDefaultExpression<RawServerDefault>,
  FastifyBaseLogger,
  TypeBoxTypeProvider
>;

//? 기존 FastifyPluginCallbackTypebox을 덮어씌우기 위해 사용
export type FastifyPluginAsyncTypebox<
  Options extends FastifyPluginOptions = Record<never, never>,
> = (fastify: FastifyTypeBox, opts: Options) => Promise<void>;
