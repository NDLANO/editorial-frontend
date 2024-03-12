/**
 * Copyright (c) 2023-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { test, expect } from "@playwright/test";
import { mockRoute, mockWaitResponse } from "../apiMock";
import {
  responsiblesMock,
  userDataMock,
  zendeskMock,
  getNoteUsersMock,
  editorMock,
  copyrightMock,
} from "../mockResponses";

test.beforeEach(async ({ page }) => {
  const licenses = mockRoute({
    page,
    path: "**/draft-api/v1/drafts/licenses/",
    fixture: "search_concept_licenses",
  });

  const subjects = mockRoute({
    page,
    path: "**/taxonomy/v1/nodes?language=nb&nodeType=SUBJECT",
    fixture: "search_concept_subjects",
  });

  const getEditors = mockRoute({
    page,
    path: "**/get_editors",
    fixture: "search_concept_get_editors",
    overrideValue: JSON.stringify(editorMock),
  });

  const baseBody = {
    pageSize: 10,
    filterInactive: true,
    sort: "-lastUpdated",
    includeOtherStatuses: false,
    fallback: false,
    excludeRevisionLog: false,
  };

  const searchConcept = mockRoute({
    page,
    path: "**/concept-api/v1/drafts/search/",
    fixture: "search_concept_search",
    overrideValue: (val) =>
      JSON.stringify({
        ...JSON.parse(val),
        results: JSON.parse(val).results.map((result) => ({ ...result, copyright: copyrightMock })),
      }),
    postData: [
      { name: "default_1", data: { ...baseBody, page: 1 } },
      { name: "default_2", data: { ...baseBody, page: 2 } },
      {
        name: "query_1",
        data: {
          ...baseBody,
          page: 1,
          query: "Test",
        },
      },
      {
        name: "query_2",
        data: {
          ...baseBody,
          page: 2,
          query: "Test",
        },
      },
      {
        name: "subject_1",
        data: {
          ...baseBody,
          page: 1,
          subjects: ["urn:subject:6"],
        },
      },
      {
        name: "subject_2",
        data: {
          ...baseBody,
          page: 2,
          subjects: ["urn:subject:6"],
        },
      },
      {
        name: "users_1",
        data: {
          ...baseBody,
          page: 1,
          users: ["Gxfx7B-MXoFdgVZZ6p611C6w"],
        },
      },
      {
        name: "users_2",
        data: {
          ...baseBody,
          page: 2,
          users: ["Gxfx7B-MXoFdgVZZ6p611C6w"],
        },
      },
      {
        name: "responsibles_1",
        data: {
          ...baseBody,
          page: 1,
          responsibleIds: ["Gxfx7B-MXoFdgVZZ6p611C6w"],
        },
      },
      {
        name: "responsibles_2",
        data: {
          ...baseBody,
          page: 2,
          responsibleIds: ["Gxfx7B-MXoFdgVZZ6p611C6w"],
        },
      },
      {
        name: "language_1",
        data: { ...baseBody, page: 1, language: "en" },
      },
      {
        name: "language_2",
        data: { ...baseBody, page: 2, language: "en" },
      },
      {
        name: "status_1",
        data: {
          ...baseBody,
          page: 1,
          status: ["IN_PROGRESS"],
        },
      },
      {
        name: "status_2",
        data: {
          ...baseBody,
          page: 2,
          status: ["IN_PROGRESS"],
        },
      },
    ],
  });

  const zendesk = mockRoute({
    page,
    path: "**/get_zendesk_token",
    fixture: "search_concept_zendesk_token",
    overrideValue: JSON.stringify(zendeskMock),
  });

  const noteUsers = mockRoute({
    page,
    path: "**/get_note_users?*",
    fixture: "search_concept_note_users",
    overrideValue: JSON.stringify(getNoteUsersMock),
  });

  const userData = mockRoute({
    page,
    path: "**/draft-api/v1/user-data",
    fixture: "search_concept_user_data",
    overrideValue: JSON.stringify(userDataMock),
  });

  const responsibles = mockRoute({
    page,
    path: "**/get_responsibles*",
    fixture: "search_concept_responsibles",
    overrideValue: JSON.stringify(responsiblesMock),
  });

  const statusStateMachine = mockRoute({
    page,
    path: "**/concept-api/v1/drafts/status-state-machine/",
    fixture: "search_concept_status_state_machine",
  });

  await page.goto("/search/concept?page=1&page-size=10&sort=-lastUpdated");

  await Promise.all([
    licenses,
    statusStateMachine,
    searchConcept,
    subjects,
    noteUsers,
    responsibles,
    zendesk,
    userData,
    getEditors,
  ]);
});

const totalSearchCount = "5029";

test.afterEach(async ({ page }) => mockWaitResponse(page, "**/concept-api/v1/drafts/search/"));

test("Can use text input", async ({ page }) => {
  await page.locator('input[name="query"]').fill("Test");
  await page.getByRole("button", { name: "Søk", exact: true }).click();
  await page.getByTestId("concept-search-result").first().waitFor();
  expect(await page.getByTestId("searchTotalCount").innerText()).toEqual("88");
  await page.locator('input[name="query"]').clear();
  await page.getByRole("button", { name: "Søk", exact: true }).click();
  await page.getByTestId("concept-search-result").first().waitFor();
  expect(await page.getByTestId("searchTotalCount").innerText()).toEqual(totalSearchCount);
});

test("Can use status dropdown", async ({ page }) => {
  await page.locator('select[name="status"]').selectOption({ index: 1 });
  await page.getByTestId("concept-search-result").first().waitFor();
  expect(await page.getByTestId("searchTotalCount").innerText()).toEqual("1009");
  await page.locator('select[name="status"]').selectOption({ index: 0 });
  await page.getByTestId("concept-search-result").first().waitFor();
  expect(await page.getByTestId("searchTotalCount").innerText()).toEqual(totalSearchCount);
});

test("Can use language dropdown", async ({ page }) => {
  await page.locator('select[name="language"]').selectOption({ label: "Engelsk" });
  await page.getByTestId("concept-search-result").first().waitFor();
  expect(await page.getByTestId("searchTotalCount").innerText()).toEqual("35");
  await page.locator('select[name="language"]').selectOption({ index: 0 });
  await page.getByTestId("concept-search-result").first().waitFor();
  expect(await page.getByTestId("searchTotalCount").innerText()).toEqual(totalSearchCount);
});

test("Can use subject dropdown", async ({ page }) => {
  await page.locator('select[name="subjects"]').selectOption({ index: 3 });
  await page.getByTestId("concept-search-result").first().waitFor();
  expect(await page.getByTestId("searchTotalCount").innerText()).toEqual("369");
  await page.locator('select[name="subjects"]').selectOption({ index: 0 });
  await page.getByTestId("concept-search-result").first().waitFor();
  expect(await page.getByTestId("searchTotalCount").innerText()).toEqual(totalSearchCount);
});

test("Can use responsible dropdown", async ({ page }) => {
  await page.locator('select[name="responsible-ids"]').selectOption({ label: "Ed Test" });
  await page.getByTestId("concept-search-result").first().waitFor();
  expect(await page.getByTestId("searchTotalCount").innerText()).toEqual("12");
  await page.locator('select[name="responsible-ids"]').selectOption({ index: 0 });
  await page.getByTestId("concept-search-result").first().waitFor();
  expect(await page.getByTestId("searchTotalCount").innerText()).toEqual(totalSearchCount);
});

test("Can use user dropdown", async ({ page }) => {
  await page.locator('select[name="users"]').selectOption({ label: "Ed Test" });
  await page.getByTestId("concept-search-result").first().waitFor();
  expect(await page.getByTestId("searchTotalCount").innerText()).toEqual("18");
  await page.locator('select[name="users"]').selectOption({ index: 0 });
  await page.getByTestId("concept-search-result").first().waitFor();
  expect(await page.getByTestId("searchTotalCount").innerText()).toEqual(totalSearchCount);
});
