/*
 * Copyright (c) 2021-present, NDLA.
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { useQueries } from '@tanstack/react-query';
import { GREP_CODE } from '../../queryKeys';
import { fetchGrepCodeTitle } from './grepApi';
import { GrepCode } from './grepApiInterfaces';

const grepToGrepCodeObject = (grepCode: string, grepCodeTitle: string | undefined): GrepCode => ({
  code: grepCode,
  title: grepCodeTitle ? `${grepCode} - ${grepCodeTitle}` : grepCode,
});

export const grepCodeQueryKey = (params?: Partial<{ grepCode: string }>) => [GREP_CODE, params];

export const useGrepCodes = (grepCodes: string[], enabled = true) => {
  return useQueries({
    queries: grepCodes.map((grepCode) => ({
      queryKey: grepCodeQueryKey({ grepCode }),
      queryFn: () => fetchGrepCodeTitle(grepCode),
      select: (title: string | undefined) => grepToGrepCodeObject(grepCode, title),
      enabled,
    })),
  });
};
