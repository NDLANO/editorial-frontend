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
  await page.goto("/search/concept?page=1&page-size=10&sort=-lastUpdated");
});

const totalSearchCount = "5032";

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
  expect(await page.getByTestId("searchTotalCount").innerText()).toEqual("1010");
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
