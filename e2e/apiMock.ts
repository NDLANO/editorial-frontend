/**
 * Copyright (c) 2023-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { readFile, writeFile, mkdir } from "fs/promises";
import { Page } from "@playwright/test";
const mockDir = "e2e/apiMocks/";

type PostDataMock = {
  name: string;
  data: Record<string, any>;
};

interface MockRoute {
  page: Page;
  path: string | RegExp;
  fixture: string;
  overrideValue?: string | ((value: string) => string);
  postData?: PostDataMock[];
  status?: number;
  overrideRoute?: boolean;
}

export const mockRoute = async ({
  page,
  path,
  fixture,
  overrideValue,
  overrideRoute,
  postData,
  status = 200,
}: MockRoute) => {
  if (overrideRoute) {
    await page.unroute(path);
  }

  return await page.route(path, async (route) => {
    const method = route.request().method();
    if (method === "GET" || method === "POST") {
      if (process.env.RECORD_FIXTURES === "true") {
        const response = await route.fetch();

        let fixtureName = `${mockDir}${fixture}.json`;
        if (method === "POST") {
          const requestPostData = route.request().postDataJSON() ?? {};
          const result = postData?.find(
            ({ data }) => Object.entries(data).sort().toString() === Object.entries(requestPostData).sort().toString(),
          );
          if (!result) return;
          fixtureName = `${mockDir}${fixture}_${result.name}.json`;
        }

        const text = await response.text();
        const override = overrideValue
          ? typeof overrideValue === "string"
            ? overrideValue
            : overrideValue(text)
          : undefined;
        await mkdir(mockDir, { recursive: true });
        await writeFile(fixtureName, override ?? text, {
          flag: "w",
        });
        return route.fulfill({ body: text, status });
      } else {
        try {
          if (method === "POST") {
            const requestPostData = route.request().postDataJSON() ?? {};
            const result = postData?.find(
              ({ data }) =>
                Object.entries(data).sort().toString() === Object.entries(requestPostData).sort().toString(),
            );
            if (result) {
              const res = await readFile(`${mockDir}${fixture}_${result.name}.json`, "utf8");
              return route.fulfill({ body: res, status });
            }
          } else if (method === "GET") {
            const res = await readFile(`${mockDir}${fixture}.json`, "utf8");
            return route.fulfill({ body: res, status });
          }
        } catch (e) {
          route.abort();
        }
      }
    }
  });
};

interface GraphqlMockRoute {
  page: Page;
  operationNames: string[];
  fixture: string;
  overrideRoute?: boolean;
}

export const mockGraphqlRoute = async ({ page, operationNames, fixture, overrideRoute }: GraphqlMockRoute) => {
  if (overrideRoute) {
    await page.unroute("**/graphql-api/graphql");
  }

  return await page.route("**/graphql-api/graphql", async (route) => {
    if (process.env.RECORD_FIXTURES === "true") {
      const body = await route.request().postDataJSON();
      const res = await route.fetch();
      if (operationNames.includes(body.operationName)) {
        await mkdir(mockDir, { recursive: true });
        await writeFile(`${mockDir}${fixture}_${body.operationName}.json`, await res.text(), {
          flag: "w",
        });
        return route.fulfill({ contentType: "application/json", body: await res.text() });
      }
    } else {
      const body = await route.request().postDataJSON();
      if (operationNames.includes(body.operationName)) {
        try {
          const res = await readFile(`${mockDir}${fixture}_${body.operationName}.json`, "utf-8");
          return route.fulfill({ contentType: "application/json", body: res });
        } catch (e) {
          route.abort();
        }
      }
    }
  });
};

export const mockWaitResponse = async (page: Page, url: string) => {
  if (process.env.RECORD_FIXTURES === "true") {
    await page.waitForResponse(url);
  }
};
