/**
 * Copyright (c) 2023-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { readFile, writeFile, mkdir } from "fs/promises";
import isEqual from "lodash/isEqual.js";
import { Page, Route } from "@playwright/test";
const mockDir = "e2e/apiMocks/";

type PostDataMock = {
  name: string;
  data: Record<string, any>;
};

type OverrideValue = string | ((value: string) => string);
interface MockRoute {
  page: Page;
  path: string | RegExp;
  fixture: string;
  overrideValue?: OverrideValue;
  postData?: PostDataMock[];
  status?: number;
  overrideRoute?: boolean;
}

const evaluateHttpMethods = ["GET", "POST"];

const writeToFile = async (responseText: string, fixtureName: string, overrideValue?: OverrideValue) => {
  const override = overrideValue
    ? typeof overrideValue === "string"
      ? overrideValue
      : overrideValue(responseText)
    : undefined;
  await mkdir(mockDir, { recursive: true });
  await writeFile(fixtureName, override ?? responseText, {
    flag: "w",
  });
};

const getResponseText = async (route: Route): Promise<string> =>
  evaluateHttpMethods.includes(route.request().method()) ? await (await route.fetch()).text() : "";

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
    if (route.request().method() === "POST") {
      const isExternal = path.toString().includes("http");
      const requestPostData = isExternal ? route.request().postData() ?? "" : route.request().postDataJSON() ?? {};
      const result = postData?.find(({ data }) => isEqual(data, requestPostData));
      const fixtureName = result ? `${mockDir}${fixture}_${result.name}.json` : `${mockDir}${fixture}.json`;

      if (process.env.RECORD_FIXTURES === "true") {
        const responseText = await getResponseText(route);
        await writeToFile(responseText, fixtureName, overrideValue);

        return route.fulfill({ body: responseText, status });
      } else {
        try {
          const res = await readFile(fixtureName, "utf8");
          return route.fulfill({ body: res, status });
        } catch (e) {
          route.abort();
        }
      }
    } else {
      const fixtureName = `${mockDir}${fixture}.json`;
      if (process.env.RECORD_FIXTURES === "true") {
        const responseText = await getResponseText(route);
        await writeToFile(responseText, fixtureName, overrideValue);

        return route.fulfill({ body: responseText, status });
      } else {
        try {
          const res = await readFile(fixtureName, "utf8");
          return route.fulfill({ body: res, status });
        } catch {
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
