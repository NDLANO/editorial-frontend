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
  copyrightMock,
  editorMock,
  getNoteUsersMock,
  responsiblesMock,
  userDataMock,
  zendeskMock,
} from "../mockResponses";

test.beforeEach(async ({ page }) => {
  const licenses = mockRoute({
    page,
    path: "**/draft-api/v1/drafts/licenses/",
    fixture: "search_content_licenses",
  });

  const subjects = mockRoute({
    page,
    path: "**/taxonomy/v1/resource-types?language=nb",
    fixture: "search_content_subjects",
  });

  const resourceTypes = mockRoute({
    page,
    path: "**/taxonomy/v1/nodes?language=nb&nodeType=SUBJECT",
    fixture: "search_content_resource_type",
  });

  const getEditors = mockRoute({
    page,
    path: "**/get_editors",
    fixture: "search_content_get_editors",
    overrideValue: () => JSON.stringify(editorMock),
  });

  const baseBody = { pageSize: 10, filterInactive: true, sort: "-lastUpdated" };

  const searchContent = mockRoute({
    page,
    path: "**/search-api/v1/search/editorial/",
    fixture: "search_content_search",
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
        data: { ...baseBody, page: 1, query: "Test" },
      },
      {
        name: "query_2",
        data: { ...baseBody, page: 2, query: "Test" },
      },
      {
        name: "status_1",
        data: { ...baseBody, page: 1, draftStatus: ["PUBLISHED"] },
      },
      {
        name: "status_2",
        data: { ...baseBody, page: 2, draftStatus: ["PUBLISHED"] },
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
        name: "subject_1",
        data: {
          ...baseBody,
          page: 1,
          subjects: ["urn:subject:1:83ce68bc-19c9-4f2b-8dba-caf401428f21"],
        },
      },
      {
        name: "subject_2",
        data: {
          ...baseBody,
          page: 2,
          subjects: ["urn:subject:1:83ce68bc-19c9-4f2b-8dba-caf401428f21"],
        },
      },
      {
        name: "responsible_1",
        data: {
          ...baseBody,
          page: 1,
          responsibleIds: ["Gxfx7B-MXoFdgVZZ6p611C6w"],
        },
      },
      {
        name: "responsible_2",
        data: {
          ...baseBody,
          page: 2,
          responsibleIds: ["Gxfx7B-MXoFdgVZZ6p611C6w"],
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
        name: "resource_type_1",
        data: {
          ...baseBody,
          page: 1,
          resourceTypes: ["urn:resourcetype:workAssignment"],
        },
      },
      {
        name: "resource_type_2",
        data: {
          ...baseBody,
          page: 2,
          resourceTypes: ["urn:resourcetype:workAssignment"],
        },
      },
      { name: "filter_inactive_1", data: { pageSize: 10, page: 1, filterInactive: false, sort: "-lastUpdated" } },
      { name: "filter_inactive_2", data: { pageSize: 10, page: 2, filterInactive: false, sort: "-lastUpdated" } },
      {
        name: "exclude_revision_1",
        data: {
          ...baseBody,
          page: 1,
          excludeRevisionLog: true,
        },
      },
      {
        name: "exclude_revision_2",
        data: {
          ...baseBody,
          page: 2,
          excludeRevisionLog: true,
        },
      },
    ],
  });

  const zendesk = mockRoute({
    page,
    path: "**/get_zendesk_token",
    fixture: "search_content_zendesk_token",
    overrideValue: JSON.stringify(zendeskMock),
  });

  const noteUsers = mockRoute({
    page,
    path: "**/get_note_users?*",
    fixture: "search_content_note_users",
    overrideValue: JSON.stringify(getNoteUsersMock),
  });

  const userData = mockRoute({
    page,
    path: "**/draft-api/v1/user-data",
    fixture: "search_content_user_data",
    overrideValue: JSON.stringify(userDataMock),
  });

  const responsibles = mockRoute({
    page,
    path: "**/get_responsibles*",
    fixture: "search_content_responsibles",
    overrideValue: JSON.stringify(responsiblesMock),
  });

  const statusStateMachine = mockRoute({
    page,
    path: "**/draft-api/v1/drafts/status-state-machine/",
    fixture: "search_content_status_state_machine",
  });

  await page.goto("/search/content?page=1&page-size=10&sort=-lastUpdated");

  await Promise.all([
    licenses,
    statusStateMachine,
    resourceTypes,
    searchContent,
    subjects,
    noteUsers,
    responsibles,
    zendesk,
    userData,
    getEditors,
  ]);
});

const searchTotalCount = "21481";

test.afterEach(async ({ page }) => await mockWaitResponse(page, "**/search-api/v1/search/editorial/"));

test("Can use text input", async ({ page }) => {
  await page.locator('input[name="query"]').fill("Test");
  await page.getByRole("button", { name: "Søk", exact: true }).click();
  await page.getByTestId("content-search-result").first().waitFor();
  expect(await page.getByTestId("searchTotalCount").innerText()).toEqual("1416");
  await page.locator('input[name="query"]').clear();
  await page.getByRole("button", { name: "Søk", exact: true }).click();
  await page.getByTestId("content-search-result").first().waitFor();
  expect(await page.getByTestId("searchTotalCount").innerText()).toEqual(searchTotalCount);
});

test("Can use status dropdown", async ({ page }) => {
  await page.locator('select[name="draft-status"]').selectOption({ label: "Publisert" });
  await page.getByTestId("content-search-result").first().waitFor();
  expect(await page.getByTestId("searchTotalCount").innerText()).toEqual("17876");
  await page.locator('select[name="draft-status"]').selectOption({ index: 0 });
  await page.getByTestId("content-search-result").first().waitFor();
  expect(await page.getByTestId("searchTotalCount").innerText()).toEqual(searchTotalCount);
});

test("Can use language dropdown", async ({ page }) => {
  await page.locator('select[name="language"]').selectOption({ index: 1 });
  await page.getByTestId("content-search-result").first().waitFor();
  expect(await page.getByTestId("searchTotalCount").innerText()).toEqual("19211");
  await page.locator('select[name="language"]').selectOption({ index: 0 });
  await page.getByTestId("content-search-result").first().waitFor();
  expect(await page.getByTestId("searchTotalCount").innerText()).toEqual(searchTotalCount);
});

test("Can use subject dropdown", async ({ page }) => {
  await page.locator('select[name="subjects"]').selectOption({ label: "Biologi 1" });
  await page.getByTestId("content-search-result").first().waitFor();
  expect(await page.getByTestId("searchTotalCount").innerText()).toEqual("617");
  await page.locator('select[name="subjects"]').selectOption({ index: 0 });
  await page.getByTestId("content-search-result").first().waitFor();
  expect(await page.getByTestId("searchTotalCount").innerText()).toEqual(searchTotalCount);
});

test("Can use responsible dropdown", async ({ page }) => {
  await page.locator('select[name="responsible-ids"]').selectOption({ label: "Ed Test" });
  await page.getByTestId("content-search-result").first().waitFor();
  expect(await page.getByTestId("searchTotalCount").innerText()).toEqual("22");
  await page.locator('select[name="responsible-ids"]').selectOption({ index: 0 });
  await page.getByTestId("content-search-result").first().waitFor();
  expect(await page.getByTestId("searchTotalCount").innerText()).toEqual(searchTotalCount);
});

test("Can use user dropdown", async ({ page }) => {
  await page.locator('select[name="users"]').selectOption({ label: "Ed Test" });
  await page.getByTestId("content-search-result").first().waitFor();
  expect(await page.getByTestId("searchTotalCount").innerText()).toEqual("106");
  await page.locator('select[name="users"]').selectOption({ index: 0 });
  await page.getByTestId("content-search-result").first().waitFor();
  expect(await page.getByTestId("searchTotalCount").innerText()).toEqual(searchTotalCount);
});

test("Can use content type dropdown", async ({ page }) => {
  await page.locator('select[name="resource-types"]').selectOption({ label: "Arbeidsoppdrag" });
  await page.getByTestId("content-search-result").first().waitFor();
  expect(await page.getByTestId("searchTotalCount").innerText()).toEqual("551");
  await page.locator('select[name="resource-types"]').selectOption({ index: 0 });
  await page.getByTestId("content-search-result").first().waitFor();
  expect(await page.getByTestId("searchTotalCount").innerText()).toEqual(searchTotalCount);
});

test("Can use inactive checkbox", async ({ page }) => {
  await page.locator('input[id="checkbox-filter-inactive"]').click();
  await page.getByTestId("content-search-result").first().waitFor();
  expect(await page.getByTestId("searchTotalCount").innerText()).toEqual("37435");
  await page.locator('input[id="checkbox-filter-inactive"]').click();
  await page.getByTestId("content-search-result").first().waitFor();
  expect(await page.getByTestId("searchTotalCount").innerText()).toEqual(searchTotalCount);
});

test("Can use exclude checkbox", async ({ page }) => {
  await page.locator('input[id="checkbox-exclude-revision-log"]').click();
  await page.getByTestId("content-search-result").first().waitFor();
  expect(await page.getByTestId("searchTotalCount").innerText()).toEqual(searchTotalCount);
  await page.locator('input[id="checkbox-exclude-revision-log"]').click();
  await page.getByTestId("content-search-result").first().waitFor();
  expect(await page.getByTestId("searchTotalCount").innerText()).toEqual(searchTotalCount);
});
