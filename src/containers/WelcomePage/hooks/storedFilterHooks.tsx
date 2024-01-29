/**
 * Copyright (c) 2024-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { useCallback, useEffect, useState } from 'react';
import { SingleValue } from '@ndla/select';
import { fetchNode } from '../../../modules/nodes/nodeApi';
import { Prefix } from '../components/TableComponent';

export const useStoredSubjectFilterHook = (localStorageKey: string, language: string) => {
  const [filterSubject, _setFilterSubject] = useState<SingleValue | undefined>(undefined);
  const storedFilterSubject = localStorage.getItem(localStorageKey);

  useEffect(() => {
    if (storedFilterSubject) {
      const updateFilterSubject = async () => {
        const node = await fetchNode({
          id: storedFilterSubject,
          language,
          taxonomyVersion: 'default',
        });
        _setFilterSubject({ label: node.name, value: storedFilterSubject });
      };
      updateFilterSubject();
    }
  }, [language, storedFilterSubject]);

  const setFilterSubject = useCallback(
    (fs: SingleValue) => {
      _setFilterSubject(fs);
      fs
        ? localStorage.setItem(localStorageKey, fs.value)
        : localStorage.removeItem(localStorageKey);
    },
    [localStorageKey],
  );

  return { filterSubject, setFilterSubject };
};

const defaultPageSize = { label: '6', value: '6' };

export const useStoredPageSizeHook = (localStorageKey: string) => {
  const storedPageSize = localStorage.getItem(localStorageKey);

  const [pageSize, _setPageSize] = useState<SingleValue>(
    storedPageSize
      ? {
          label: storedPageSize,
          value: storedPageSize,
        }
      : defaultPageSize,
  );
  const setPageSize = useCallback(
    (p: SingleValue) => {
      if (!p) return;
      _setPageSize(p);
      localStorage.setItem(localStorageKey, p.value);
    },
    [localStorageKey],
  );

  return { pageSize, setPageSize };
};

export const useStoredSortOptionHook = <T extends string>(
  localStorageKey: string,
  fallbackSortOption: Prefix<'-', T>,
) => {
  const [sortOption, _setSortOption] = useState<Prefix<'-', T>>(
    (localStorage.getItem(localStorageKey) as T) || fallbackSortOption,
  );

  const setSortOption = useCallback(
    (s: Prefix<'-', T>) => {
      _setSortOption(s);
      localStorage.setItem(localStorageKey, s);
    },
    [localStorageKey],
  );

  return { sortOption, setSortOption };
};

export const useStoredToggle = (localStorageKey: string) => {
  const [isOn, _setIsOn] = useState(localStorage.getItem(localStorageKey) === 'true');

  const setIsOn = useCallback(
    (p: boolean) => {
      _setIsOn(p);
      localStorage.setItem(localStorageKey, p.toString());
    },
    [localStorageKey],
  );
  return { isOn, setIsOn };
};
