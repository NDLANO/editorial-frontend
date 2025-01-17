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
  await page.goto("/search/image?page=1&page-size=10&sort=-relevance");
});

const totalSearchCount = 69084;

test("Can use text input", async ({ page }) => {
  await page.locator('input[name="query"]').fill("Test");
  await page.getByRole("button", { name: "Søk", exact: true }).click();
  await page.getByTestId("image-search-result").first().waitFor();
  expect(Number(await page.getByTestId("searchTotalCount").innerText())).toBeGreaterThanOrEqual(400);
  await page.locator('input[name="query"]').clear();
  await page.getByRole("button", { name: "Søk", exact: true }).click();
  await page.getByTestId("image-search-result").first().waitFor();
  expect(Number(await page.getByTestId("searchTotalCount").innerText())).toBeGreaterThanOrEqual(totalSearchCount);
});

test("Can use model released dropdown", async ({ page }) => {
  await page.getByTestId("model-released-select").click();
  await page.getByRole("option", { name: "Modellklarert", exact: true }).click();
  await page.getByTestId("image-search-result").first().waitFor();
  expect(Number(await page.getByTestId("searchTotalCount").innerText())).toBeGreaterThanOrEqual(2200);
  await page.getByTestId("remove-tag-button").click();
  await page.getByTestId("image-search-result").first().waitFor();
  expect(Number(await page.getByTestId("searchTotalCount").innerText())).toBeGreaterThanOrEqual(totalSearchCount);
});

test("Can use language dropdown", async ({ page }) => {
  await page.getByTestId("language-select").click();
  await page.getByRole("option", { name: "Bokmål", exact: true }).click();
  await page.getByTestId("image-search-result").first().waitFor();
  expect(Number(await page.getByTestId("searchTotalCount").innerText())).toBeGreaterThanOrEqual(26000);
  await page.getByTestId("remove-tag-button").click();
  await page.getByTestId("image-search-result").first().waitFor();
  expect(Number(await page.getByTestId("searchTotalCount").innerText())).toBeGreaterThanOrEqual(totalSearchCount);
});

test("Can use license dropdown", async ({ page }) => {
  await page.getByTestId("license-select").click();
  await page.getByRole("option", { name: "CC0 Public domain dedication: Gitt til fellesskapet", exact: true }).click();
  await page.getByTestId("image-search-result").first().waitFor();
  expect(Number(await page.getByTestId("searchTotalCount").innerText())).toBeGreaterThanOrEqual(900);
  await page.getByTestId("remove-tag-button").click();
  await page.getByTestId("image-search-result").first().waitFor();
  expect(Number(await page.getByTestId("searchTotalCount").innerText())).toBeGreaterThanOrEqual(totalSearchCount);
});
