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
  overrideValue?: string | ((value: string) => string);
  status?: number;
  overrideRoute?: boolean;
}

export const mockRoute = async ({
  page,
  path,
  fixture,
  overrideValue,
  overrideRoute,
  status = 200,
}: MockRoute) => {
  if (overrideRoute) {
    await page.unroute(path);
  }

  return await page.route(path, async (route) => {
    if (process.env.RECORD_FIXTURES === 'true') {
      const res = await route.fetch();
      const text = await res.text();
      const override = overrideValue
        ? typeof overrideValue === 'string'
          ? overrideValue
          : overrideValue(text)
        : undefined;
      await mkdir(mockDir, { recursive: true });
      await writeFile(`${mockDir}${fixture}.json`, override ?? text, {
        flag: 'w',
      });
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
