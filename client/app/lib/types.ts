import type {
  UseQueryOptions,
  UseMutationOptions,
} from '@tanstack/react-query';

// (Omit<UseQueryOptions<Comment[], unknown, Comment[], (string | number)[]>, "initialData" | ... 1 more ... | "queryKey"> & {
//   ...;
// }) | undefined

export type UseQueryOptionsOf<T extends (...args: any) => any> =
  UseQueryOptions<
    Awaited<ReturnType<T>>,
    unknown,
    Awaited<ReturnType<T>>,
    any[]
  >;

export type UseMutationOptionsOf<
  T extends (...args: any) => any,
  E = any,
> = UseMutationOptions<Awaited<ReturnType<T>>, E, Parameters<T>[0]>;
