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

const totalSearchCount = "69084";

test("Can use text input", async ({ page }) => {
  await page.locator('input[name="query"]').fill("Test");
  await page.getByRole("button", { name: "Søk", exact: true }).click();
  await page.getByTestId("image-search-result").first().waitFor();
  expect(await page.getByTestId("searchTotalCount").innerText()).toEqual("419");
  await page.locator('input[name="query"]').clear();
  await page.getByRole("button", { name: "Søk", exact: true }).click();
  await page.getByTestId("image-search-result").first().waitFor();
  expect(await page.getByTestId("searchTotalCount").innerText()).toEqual(totalSearchCount);
});

test("Can use model released dropdown", async ({ page }) => {
  await page.locator('select[name="model-released"]').selectOption({ index: 1 });
  await page.getByTestId("image-search-result").first().waitFor();
  expect(await page.getByTestId("searchTotalCount").innerText()).toEqual("2248");
  await page.locator('select[name="model-released"]').selectOption({ index: 0 });
  await page.getByTestId("image-search-result").first().waitFor();
  expect(await page.getByTestId("searchTotalCount").innerText()).toEqual(totalSearchCount);
});

test("Can use language dropdown", async ({ page }) => {
  await page.locator('select[name="language"]').selectOption({ index: 1 });
  await page.getByTestId("image-search-result").first().waitFor();
  expect(await page.getByTestId("searchTotalCount").innerText()).toEqual("26966");
  await page.locator('select[name="language"]').selectOption({ index: 0 });
  await page.getByTestId("image-search-result").first().waitFor();
  expect(await page.getByTestId("searchTotalCount").innerText()).toEqual(totalSearchCount);
});

test("Can use license dropdown", async ({ page }) => {
  await page.locator('select[name="license"]').selectOption({ index: 1 });
  await page.getByTestId("image-search-result").first().waitFor();
  expect(await page.getByTestId("searchTotalCount").innerText()).toEqual("906");
  await page.locator('select[name="license"]').selectOption({ index: 0 });
  await page.getByTestId("image-search-result").first().waitFor();
  expect(await page.getByTestId("searchTotalCount").innerText()).toEqual(totalSearchCount);
});
