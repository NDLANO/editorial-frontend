/**
 * Copyright (c) 2024-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { useCallback, useEffect, useState } from "react";
import { fetchNode } from "../../../modules/nodes/nodeApi";
import { Prefix } from "../components/TableComponent";
import { SelectItem } from "../types";

type ReturnStateType<T> = [T, (v: T) => void];

export const useLocalStorageSubjectFilterState = (
  localStorageKey: string,
  language: string,
): ReturnStateType<SelectItem | undefined> => {
  const [filterSubject, _setFilterSubject] = useState<SelectItem | undefined>(undefined);
  const storedFilterSubject = localStorage.getItem(localStorageKey);

  useEffect(() => {
    if (storedFilterSubject) {
      const updateFilterSubject = async () => {
        const node = await fetchNode({
          id: storedFilterSubject,
          language,
          taxonomyVersion: "default",
        });
        _setFilterSubject({ label: node.name, value: storedFilterSubject });
      };
      updateFilterSubject();
    }
  }, [language, storedFilterSubject]);

  const setFilterSubject = useCallback(
    (fs: SelectItem | undefined) => {
      _setFilterSubject(fs);
      fs ? localStorage.setItem(localStorageKey, fs.value) : localStorage.removeItem(localStorageKey);
    },
    [localStorageKey],
  );

  return [filterSubject, setFilterSubject];
};

const defaultPageSize = { label: "6", value: "6" };

export const useLocalStoragePageSizeState = (localStorageKey: string): ReturnStateType<SelectItem> => {
  const storedPageSize = localStorage.getItem(localStorageKey);

  const [pageSize, _setPageSize] = useState<SelectItem>(
    storedPageSize
      ? {
          label: storedPageSize,
          value: storedPageSize,
        }
      : defaultPageSize,
  );
  const setPageSize = useCallback(
    (p: SelectItem) => {
      if (!p) return;
      _setPageSize(p);
      localStorage.setItem(localStorageKey, p.value);
    },
    [localStorageKey],
  );

  return [pageSize, setPageSize];
};

export const useLocalStorageSortOptionState = <T extends string>(
  localStorageKey: string,
  fallbackSortOption: Prefix<"-", T>,
): ReturnStateType<Prefix<"-", T>> => {
  const [sortOption, _setSortOption] = useState<Prefix<"-", T>>(
    (localStorage.getItem(localStorageKey) as T) || fallbackSortOption,
  );

  const setSortOption = useCallback(
    (s: Prefix<"-", T>) => {
      _setSortOption(s);
      localStorage.setItem(localStorageKey, s);
    },
    [localStorageKey],
  );

  return [sortOption, setSortOption];
};
export const useLocalStorageBooleanState = (localStorageKey: string): ReturnStateType<boolean> => {
  const [value, _setValue] = useState(localStorage.getItem(localStorageKey) === "true");

  const setValue = useCallback(
    (p: boolean) => {
      _setValue(p);
      localStorage.setItem(localStorageKey, p.toString());
    },
    [localStorageKey],
  );
  return [value, setValue];
};
