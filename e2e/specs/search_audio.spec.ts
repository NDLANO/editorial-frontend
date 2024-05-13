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
  await page.goto("/search/audio?page=1&page-size=10&sort=-relevance");
});

const totalSearchCount = "3300";

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
