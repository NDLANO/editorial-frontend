/**
 * Copyright (c) 2023-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { Page } from '@playwright/test';
import { readFile, writeFile, mkdir } from 'fs/promises';
const mockDir = 'e2e/apiMocks/';

interface MockRoute {
  page: Page;
  path: string | RegExp;
  fixture: string;
  overrideValue?: string;
  status?: number;
}

export const mockRoute = async ({
  page,
  path,
  fixture,
  overrideValue,
  status = 200,
}: MockRoute) => {
  return await page.route(path, async (route) => {
    if (process.env.RECORD_FIXTURES === 'true') {
      const res = await route.fetch();
      const text = await res.text();
      await mkdir(mockDir, { recursive: true });
      await writeFile(`${mockDir}${fixture}.json`, overrideValue ?? text, { flag: 'w' });
      return route.fulfill({ body: text, status });
    } else {
      try {
        const res = await readFile(`${mockDir}${fixture}.json`, 'utf8');
        return route.fulfill({ body: res, status });
      } catch (e) {
        route.abort();
      }
    }
  });
};
