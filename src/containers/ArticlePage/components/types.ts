/**
 * Copyright (c) 2024-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { IArticleDTO } from "@ndla/types-backend/draft-api";

// https://stackoverflow.com/a/68404823
// Creates a string union type based on all nested keys in T with dot notation. E.g. NestedKeys<{a: {b: string}; b: number}> = "b" | "a.b"
type DotPrefix<T extends string> = T extends "" ? "" : `.${T}`;
type NestedKeys<InputObject> = (
  InputObject extends object
    ? { [Key in Exclude<keyof InputObject, symbol>]: `${Key}${DotPrefix<NestedKeys<InputObject[Key]>>}` }[Exclude<
        keyof InputObject,
        symbol
      >]
    : ""
) extends infer Result
  ? Extract<Result, string>
  : never;

export type FlatArticleKeys = NestedKeys<IArticleDTO>;
