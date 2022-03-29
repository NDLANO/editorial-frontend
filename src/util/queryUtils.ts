/*
 * Copyright (c) 2021-present, NDLA.
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { useQueries, UseQueryOptions, UseQueryResult } from 'react-query';

// From https://blog.johnnyreilly.com/2021/01/03/strongly-typing-react-query-s-usequeries/
// Should be used instead of useQueries until react-query figures out how to handle typed useQueries.
type Awaited<T> = T extends PromiseLike<infer U> ? Awaited<U> : T;

export function useQueriesTyped<TQueries extends readonly UseQueryOptions[]>(
  queries: [...TQueries],
): {
  [ArrayElement in keyof TQueries]: UseQueryResult<
    TQueries[ArrayElement] extends { select: infer TSelect }
      ? TSelect extends (data: any) => any
        ? ReturnType<TSelect>
        : never
      : Awaited<
          ReturnType<NonNullable<Extract<TQueries[ArrayElement], UseQueryOptions>['queryFn']>>
        >
  >;
} {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return useQueries(queries as UseQueryOptions<unknown, unknown, unknown>[]) as any;
}
