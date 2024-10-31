/**
 * Copyright (c) 2023-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { expect } from "@playwright/test";
import { test } from "../apiMock";

test.beforeEach(async ({ page }) => {
  await page.goto("/search/content?page=1&page-size=10&sort=-lastUpdated");
});

const searchTotalCount = "26732";

test("Can use text input", async ({ page }) => {
  await page.locator('input[name="query"]').fill("Test");
  await page.getByRole("button", { name: "Søk", exact: true }).click();
  await page.getByTestId("content-search-result").first().waitFor();
  expect(await page.getByTestId("searchTotalCount").innerText()).toEqual("1561");
  await page.locator('input[name="query"]').clear();
  await page.getByRole("button", { name: "Søk", exact: true }).click();
  await page.getByTestId("content-search-result").first().waitFor();
  expect(await page.getByTestId("searchTotalCount").innerText()).toEqual(searchTotalCount);
});

test("Can use status dropdown", async ({ page }) => {
  await page.locator('select[name="draft-status"]').selectOption({ label: "Publisert" });
  await page.getByTestId("content-search-result").first().waitFor();
  expect(await page.getByTestId("searchTotalCount").innerText()).toEqual("17854");
  await page.locator('select[name="draft-status"]').selectOption({ index: 0 });
  await page.getByTestId("content-search-result").first().waitFor();
  expect(await page.getByTestId("searchTotalCount").innerText()).toEqual(searchTotalCount);
});

test("Can use language dropdown", async ({ page }) => {
  await page.locator('select[name="language"]').selectOption({ index: 1 });
  await page.getByTestId("content-search-result").first().waitFor();
  expect(await page.getByTestId("searchTotalCount").innerText()).toEqual("24326");
  await page.locator('select[name="language"]').selectOption({ index: 0 });
  await page.getByTestId("content-search-result").first().waitFor();
  expect(await page.getByTestId("searchTotalCount").innerText()).toEqual(searchTotalCount);
});

test("Can use subject dropdown", async ({ page }) => {
  await page.locator('select[name="subjects"]').selectOption({ label: "Biologi 1" });
  await page.getByTestId("content-search-result").first().waitFor();
  expect(await page.getByTestId("searchTotalCount").innerText()).toEqual("620");
  await page.locator('select[name="subjects"]').selectOption({ index: 0 });
  await page.getByTestId("content-search-result").first().waitFor();
  expect(await page.getByTestId("searchTotalCount").innerText()).toEqual(searchTotalCount);
});

test("Can use responsible dropdown", async ({ page }) => {
  await page.locator('select[name="responsible-ids"]').selectOption({ label: "Ed Test" });
  await page.getByTestId("content-search-result").first().waitFor();
  expect(await page.getByTestId("searchTotalCount").innerText()).toEqual("33");
  await page.locator('select[name="responsible-ids"]').selectOption({ index: 0 });
  await page.getByTestId("content-search-result").first().waitFor();
  expect(await page.getByTestId("searchTotalCount").innerText()).toEqual(searchTotalCount);
});

test("Can use user dropdown", async ({ page }) => {
  await page.locator('select[name="users"]').selectOption({ label: "Ed Test" });
  await page.getByTestId("content-search-result").first().waitFor();
  expect(await page.getByTestId("searchTotalCount").innerText()).toEqual("108");
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
  await page.locator("label", { hasText: "Inkluder utgåtte fag" }).click();
  await page.getByTestId("content-search-result").first().waitFor();
  expect(await page.getByTestId("searchTotalCount").innerText()).toEqual("42700");
  await page.locator("label", { hasText: "Inkluder utgåtte fag" }).click();
  await page.getByTestId("content-search-result").first().waitFor();
  expect(await page.getByTestId("searchTotalCount").innerText()).toEqual(searchTotalCount);
});

test("Can use exclude checkbox", async ({ page }) => {
  await page.locator("label", { hasText: "Ekskluder endringslogg" }).click();
  await page.getByTestId("content-search-result").first().waitFor();
  expect(await page.getByTestId("searchTotalCount").innerText()).toEqual(searchTotalCount);
  await page.locator("label", { hasText: "Ekskluder endringslogg" }).click();
  await page.getByTestId("content-search-result").first().waitFor();
  expect(await page.getByTestId("searchTotalCount").innerText()).toEqual(searchTotalCount);
});
