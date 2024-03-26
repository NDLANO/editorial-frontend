/**
 * Copyright (c) 2023-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { readFile, writeFile, mkdir } from "fs/promises";
import { test as Ptest } from "@playwright/test";
import {
  brightcoveTokenMock,
  copyrightMock,
  editorMock,
  getNoteUsersMock,
  responsiblesMock,
  userDataMock,
  zendeskMock,
} from "./mockResponses";

const mockDir = "e2e/apiMocks/";

const localHostRegex = "http://localhost:3000/(?!@)((?!/).)+";
const apiTestRegex = "https://api.test.ndla.no/.*";
const mathjax = "https://www.wiris.net/.*";
const brightCoveRegex = "https://(.*).brightcove.(com|net)/(.+/)?([^/]+)";

interface ExtendParams {
  harCheckpoint: () => Promise<void>;
}
const regex = new RegExp(`^(${localHostRegex}|${apiTestRegex}|${mathjax}|${brightCoveRegex})$`);

export const test = Ptest.extend<ExtendParams>({
  harCheckpoint: [
    async ({ context, page }, use) => {
      let checkpointIndex = 0;

      // Appending the checkpoint index to the request headers
      // Only appended for the stored headers in the HAR file
      await context.route(
        regex,
        async (route, request) =>
          await route.fallback({
            headers: {
              ...request.headers(),
              "X-Playwright-Checkpoint": `${checkpointIndex}`,
            },
          }),
      );

      // Appending the checkpoint index to the request headers
      process.env.RECORD_FIXTURES !== "true" &&
        (await page.setExtraHTTPHeaders({
          "X-Playwright-Checkpoint": `${checkpointIndex}`,
        }));

      // Appending the new checkpoint index to the request headers
      await use(async () => {
        checkpointIndex += 1;
        process.env.RECORD_FIXTURES !== "true" &&
          (await page.setExtraHTTPHeaders({
            "X-Playwright-Checkpoint": `${checkpointIndex}`,
          }));
      });
    },
    { auto: true, scope: "test" },
  ],
  page: async ({ page }, use, testInfo) => {
    // Creating the API mocking for the wanted API's 
    await page.routeFromHAR(`${mockDir}${testInfo.titlePath[0].split("/")[1]},${testInfo.title}.har`, {
      update: process.env.RECORD_FIXTURES === "true",
      updateMode: "minimal",
      url: regex,
      updateContent: "embed",
    });

    await use(page);

    await page.close();
  },
  context: async ({ context }, use, testInfo) => {
    await use(context);
    await context.close();
    // Removing sensitive data from the HAR file after saving. Har files are saved on close. 
    process.env.RECORD_FIXTURES === "true" &&
      (await removeSensitiveData(`${mockDir}${testInfo.titlePath[0].split("/")[1]},${testInfo.title}.har`));
  },
});

const urlsToReplace = [
  {
    url: "get_zendesk_token",
    value: zendeskMock,
  },
  {
    url: "get_responsibles",
    value: responsiblesMock,
  },
  {
    url: "draft-api/v1/user-data",
    value: userDataMock,
  },
  {
    url: "get_note_users",
    value: getNoteUsersMock,
  },
  {
    url: "get_brightcove_token",
    value: brightcoveTokenMock,
  },
  {
    url: "get_editors",
    value: editorMock,
  },
];

const removeSensitiveData = async (fileName: string) => {
  const data = JSON.parse(await readFile(fileName, "utf8"));
  data["log"]["entries"].forEach((entry: any, index: number) => {
    const val = urlsToReplace.find(({ url }) => entry["request"]["url"].includes(url));
    if (val) {
      data["log"]["entries"][index]["response"]["content"]["text"] = JSON.stringify(val.value);
    }
  });

  const result = JSON.stringify(data)
    .replaceAll(/\\"license\\":{.*?}/g, `\\"license\\":${JSON.stringify(copyrightMock.license).replace(/["]/g, '\\"')}`)
    .replaceAll(
      /\\"creators\\":\[.*?\]/g,
      `\\"creators\\":${JSON.stringify(copyrightMock.creators).replace(/["]/g, '\\"')}`,
    )
    .replaceAll(
      /\\"processors\\":\[.*?\]/g,
      `\\"processors\\":${JSON.stringify(copyrightMock.processors).replace(/["]/g, '\\"')}`,
    )
    .replaceAll(
      /\\"rightsholders\\":\[.*?\]/g,
      `\\"rightsholders\\":${JSON.stringify(copyrightMock.rightsholders).replace(/["]/g, '\\"')}`,
    )
    .replaceAll(/"Bearer (.*?)"/g, '""');
  await writeFile(fileName, result, "utf8");
};
