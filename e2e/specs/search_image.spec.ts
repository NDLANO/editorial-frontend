/**
 * Copyright (c) 2023-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { test, expect } from "@playwright/test";
import { mockRoute, mockWaitResponse } from "../apiMock";
import { copyrightMock, editorMock, responsiblesMock, userDataMock, zendeskMock } from "../mockResponses";

const imageCopyrightMock = (val: any) =>
  JSON.stringify({
    ...JSON.parse(val),
    results: JSON.parse(val).results.map((image) => ({ ...image, copyright: copyrightMock })),
  });

test.beforeEach(async ({ page }) => {
  const licenses = mockRoute({
    page,
    path: "**/draft-api/v1/drafts/licenses/",
    fixture: "search_image_licenses",
  });

  const subjects = mockRoute({
    page,
    path: "**/taxonomy/v1/nodes?language=nb&nodeType=SUBJECT",
    fixture: "search_image_subjects",
  });

  const getEditors = mockRoute({
    page,
    path: "**/get_editors",
    fixture: "search_image_get_editors",
    overrideValue: JSON.stringify(editorMock),
  });

  const baseBody = {
    pageSize: 10,
    filterInactive: true,
    sort: "-relevance",
    includeOtherStatuses: false,
    fallback: false,
    excludeRevisionLog: false,
  };

  const searchImage = mockRoute({
    page,
    path: "**/image-api/v3/images/search/",
    fixture: "search_image_search",
    overrideValue: imageCopyrightMock,
    postData: [
      { name: "default_1", data: { ...baseBody, page: 1 } },
      { name: "default_2", data: { ...baseBody, page: 2 } },
      { name: "query_1", data: { ...baseBody, page: 1, query: "Test" } },
      {
        name: "query_2",
        data: { ...baseBody, page: 2, query: "Test" },
      },
      {
        name: "model_released_1",
        data: { ...baseBody, page: 1, modelReleased: ["yes"] },
      },
      {
        name: "model_released_2",
        data: { ...baseBody, page: 1, modelReleased: ["yes"] },
      },
      {
        name: "language_1",
        data: { ...baseBody, page: 1, language: "nb" },
      },
      {
        name: "language_2",
        data: { ...baseBody, page: 2, language: "nb" },
      },
      {
        name: "license_1",
        data: { ...baseBody, page: 1, license: "CC0-1.0" },
      },
      {
        name: "license_2",
        data: { ...baseBody, page: 2, license: "CC0-1.0" },
      },
    ],
  });

  const zendesk = mockRoute({
    page,
    path: "**/get_zendesk_token",
    fixture: "search_image_zendesk_token",
    overrideValue: JSON.stringify(zendeskMock),
  });

  const noteUsers = mockRoute({
    page,
    path: "**/get_note_users?*",
    fixture: "search_image_note_users",
  });

  const userData = mockRoute({
    page,
    path: "**/draft-api/v1/user-data",
    fixture: "search_image_user_data",
    overrideValue: JSON.stringify(userDataMock),
  });

  const responsibles = mockRoute({
    page,
    path: "**/get_responsibles*",
    fixture: "search_image_responsibles",
    overrideValue: JSON.stringify(responsiblesMock),
  });

  const statusStateMachine = mockRoute({
    page,
    path: "**/image-api/v3/drafts/status-state-machine/",
    fixture: "search_image_status_state_machine",
  });

  await page.goto("/search/image?page=1&page-size=10&sort=-relevance");

  await Promise.all([
    licenses,
    statusStateMachine,
    searchImage,
    subjects,
    noteUsers,
    responsibles,
    zendesk,
    userData,
    getEditors,
  ]);
});

test.afterEach(async ({ page }) => await mockWaitResponse(page, "**/image-api/v3/images/search/"));

const totalSearchCount = "68176";

test("Can use text input", async ({ page }) => {
  await page.locator('input[name="query"]').fill("Test");
  await page.getByRole("button", { name: "Søk", exact: true }).click();
  await page.getByTestId("image-search-result").first().waitFor();
  expect(await page.getByTestId("searchTotalCount").innerText()).toEqual("410");
  await page.locator('input[name="query"]').clear();
  await page.getByRole("button", { name: "Søk", exact: true }).click();
  await page.getByTestId("image-search-result").first().waitFor();
  expect(await page.getByTestId("searchTotalCount").innerText()).toEqual(totalSearchCount);
});

test("Can use model released dropdown", async ({ page }) => {
  await page.locator('select[name="model-released"]').selectOption({ index: 1 });
  await page.getByTestId("image-search-result").first().waitFor();
  expect(await page.getByTestId("searchTotalCount").innerText()).toEqual("1677");
  await page.locator('select[name="model-released"]').selectOption({ index: 0 });
  await page.getByTestId("image-search-result").first().waitFor();
  expect(await page.getByTestId("searchTotalCount").innerText()).toEqual(totalSearchCount);
});

test("Can use language dropdown", async ({ page }) => {
  await page.locator('select[name="language"]').selectOption({ index: 1 });
  await page.getByTestId("image-search-result").first().waitFor();
  expect(await page.getByTestId("searchTotalCount").innerText()).toEqual("24814");
  await page.locator('select[name="language"]').selectOption({ index: 0 });
  await page.getByTestId("image-search-result").first().waitFor();
  expect(await page.getByTestId("searchTotalCount").innerText()).toEqual(totalSearchCount);
});

test("Can use license dropdown", async ({ page }) => {
  await page.locator('select[name="license"]').selectOption({ index: 1 });
  await page.getByTestId("image-search-result").first().waitFor();
  expect(await page.getByTestId("searchTotalCount").innerText()).toEqual("844");
  await page.locator('select[name="license"]').selectOption({ index: 0 });
  await page.getByTestId("image-search-result").first().waitFor();
  expect(await page.getByTestId("searchTotalCount").innerText()).toEqual(totalSearchCount);
});
