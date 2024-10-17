/**
 * Copyright (c) 2024-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { useEffect, useState } from "react";
import useDebounce from "./useDebounce";

interface UseDelayedQuery {
  defaultQuery?: string;
  defaultPage?: number;
  debounceTime?: number;
}

export const usePaginatedQuery = ({ defaultQuery = "", defaultPage = 1, debounceTime = 300 }: UseDelayedQuery = {}) => {
  const [query, setQuery] = useState(defaultQuery);
  const [page, setPage] = useState(defaultPage);
  const delayedQuery = useDebounce(query, debounceTime);

  useEffect(() => {
    setPage(1);
  }, [delayedQuery]);

  return {
    page,
    setPage,
    query,
    delayedQuery,
    setQuery,
  };
};
