import { Static, TSchema, Type } from '@sinclair/typebox';
import { Nullable } from './typebox';

/**
 * 페이지네이션 스키마를 생성하는 함수
 * @param type list 타입에 대한 스키마
 * @returns list 타입이 지정된 스키마
 */
export const PaginationSchema = <T extends TSchema>(type: T) =>
  Type.Object({
    list: Type.Array(type),
    totalCount: Type.Integer(),
    pageInfo: Type.Object({
      hasNextPage: Type.Boolean(),
      endCursor: Nullable(Type.Integer()),
    }),
  });

interface PageInfo {
  hasNextPage: boolean;
  endCursor: number | null;
}

export interface PaginationType<T> {
  list: T[];
  totalCount: number;
  pageInfo: PageInfo;
}

export const PaginationOptionSchema = Type.Object({
  limit: Type.Optional(Nullable(Type.Integer())),
  cursor: Type.Optional(Nullable(Type.Integer())),
});

export type PaginationOptionType = Static<typeof PaginationOptionSchema>;

//? 응답 결과의 타입을 지정한 후 리턴하는 함수
export function createPagination<T>(
  params: PaginationType<T>,
): PaginationType<T> {
  return params;
}
