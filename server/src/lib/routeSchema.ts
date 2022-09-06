import { Static, TSchema } from '@sinclair/typebox';
import { FastifySchema } from 'fastify';

/**
 * FastifySchema 타입의 자동완성을 위한 함수
 * @param params
 * @returns Record<string, FastifySchema>을 상속한 타입
 */
export function createRouteSchema<T extends Record<string, FastifySchema>>(
  params: T,
) {
  return params;
}

type RouteSchema = {
  params?: TSchema;
  body?: TSchema;
  querystring?: TSchema;
};

type RouteType<T extends RouteSchema> = {
  Params: T['params'] extends TSchema ? Static<T['params']> : never;
  Body: T['body'] extends TSchema ? Static<T['body']> : never;
  Querystring: T['querystring'] extends TSchema
    ? Static<T['querystring']>
    : never;
};

/**
 * createRouteSchema 함수의 반환값을 타입을 추론함
 */
export type RoutesType<T extends Record<string, RouteSchema>> = {
  [K in keyof T]: RouteType<T[K]>;
};
