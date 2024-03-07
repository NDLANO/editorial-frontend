/**
 * Copyright (c) 2023-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { test, expect } from "@playwright/test";
import { mockRoute, mockWaitResponse } from "../apiMock";
import { copyrightMock, userDataMock, zendeskMock } from "../mockResponses";

test.beforeEach(async ({ page }) => {
  const licenses = mockRoute({
    page,
    path: "**/draft-api/v1/drafts/licenses/",
    fixture: "search_audio_licenses",
  });

  const allSubjects = mockRoute({
    page,
    path: "**/taxonomy/v1/nodes?language=nb&nodeType=SUBJECT",
    fixture: "search_audio_all_subjects",
  });

  const baseBody = { pageSize: 10, filterInactive: true, sort: "-relevance" };

  const searchAudio = mockRoute({
    page,
    path: "**/audio-api/v1/audio/search",
    fixture: "search_audio_search",
    overrideValue: (val) =>
      JSON.stringify({
        ...JSON.parse(val),
        results: JSON.parse(val).results.map((result) => ({ ...result, copyright: copyrightMock })),
      }),
    postData: [
      { name: "default_1", data: { ...baseBody, page: 1 } },
      { name: "default_2", data: { ...baseBody, page: 2 } },
      { name: "query_1", data: { ...baseBody, page: 1, query: "Test" } },
      { name: "query_2", data: { ...baseBody, page: 2, query: "Test" } },
      { name: "language_1", data: { ...baseBody, page: 1, language: "en" } },
      { name: "language_2", data: { ...baseBody, page: 2, language: "en" } },
      { name: "audio_type_1", data: { ...baseBody, page: 1, audioType: "podcast" } },
      { name: "audio_type_2", data: { ...baseBody, page: 2, audioType: "podcast" } },
    ],
  });

  const zendesk = mockRoute({
    page,
    path: "**/get_zendesk_token",
    fixture: "search_zendesk_token",
    overrideValue: JSON.stringify(zendeskMock),
  });

  const notesUser = mockRoute({
    page,
    path: "**/get_note_users?*",
    fixture: "search_note_users",
  });

  const userData = mockRoute({
    page,
    path: "**/user-data*",
    fixture: "search_user_data",
    overrideValue: JSON.stringify(userDataMock),
  });

  await page.goto("/search/audio?page=1&page-size=10&sort=-relevance");
  await Promise.all([licenses, allSubjects, searchAudio, zendesk, notesUser, userData]);
});

const totalSearchCount = "3299";

test.afterEach(async ({ page }) => mockWaitResponse(page, "**/audio-api/v1/audio/search/"));

test("Can use text input", async ({ page }) => {
  await page.locator('input[name="query"]').fill("Test");
  await page.getByRole("button", { name: "Søk", exact: true }).click();
  await page.getByTestId("audio-search-result").first().waitFor();
  expect(await page.getByTestId("searchTotalCount").innerText()).toEqual("38");
  await page.locator('input[name="query"]').clear();
  await page.getByRole("button", { name: "Søk", exact: true }).click();
  await page.getByTestId("audio-search-result").first().waitFor();
  expect(await page.getByTestId("searchTotalCount").innerText()).toEqual(totalSearchCount);
});

test("Can use audiotype dropdown", async ({ page }) => {
  await page.locator('select[name="audio-type"]').selectOption({ label: "Podkast" });
  await page.getByTestId("audio-search-result").first().waitFor();
  expect(await page.getByTestId("searchTotalCount").innerText()).toEqual("114");
  await page.locator('select[name="audio-type"]').selectOption({ label: "Velg lydfiltype" });
  await page.getByTestId("audio-search-result").first().waitFor();
  expect(await page.getByTestId("searchTotalCount").innerText()).toEqual(totalSearchCount);
});

test("Can use language dropdown", async ({ page }) => {
  await page.locator('select[name="language"]').selectOption({ label: "Engelsk" });
  await page.getByTestId("audio-search-result").first().waitFor();
  expect(await page.getByTestId("searchTotalCount").innerText()).toEqual("315");
  await page.locator('select[name="language"]').selectOption({ label: "Velg språk" });
  await page.getByTestId("audio-search-result").first().waitFor();
  expect(await page.getByTestId("searchTotalCount").innerText()).toEqual(totalSearchCount);
});
