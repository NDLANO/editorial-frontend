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
  await page.goto("/search/audio");
  await expect(page.getByRole("button", { name: "Søk", exact: true })).toBeVisible();
  await expect(page.getByTestId("loading-spinner")).not.toBeVisible();
});

test.afterEach(async ({ page }) => {
  await page.waitForURL("/search/audio");
  const count = page.getByTestId("searchTotalCount");
  await expect(count).not.toBeEmpty();
  const amount = await count.innerText();
  expect(Number(amount)).toBeGreaterThanOrEqual(totalSearchCount);
});

const totalSearchCount = 2300;

test("Can use text input", async ({ page }) => {
  await page.locator('input[name="query"]').fill("Test");
  await page.getByRole("button", { name: "Søk", exact: true }).click();
  await page.waitForURL("**/*query=Test*");
  const tagButton = page.getByRole("button", { name: "Søk: Test" });
  await expect(tagButton).toBeVisible();
  await expect(page.getByTestId("audio-search-result").first()).toBeVisible();
  expect(Number(await page.getByTestId("searchTotalCount").innerText())).toBeGreaterThanOrEqual(35);
  await page.locator('input[name="query"]').clear();
  await page.getByRole("button", { name: "Søk", exact: true }).click();
  await expect(tagButton).not.toBeVisible();
});

test("Can use audiotype dropdown", async ({ page }) => {
  await page.getByTestId("audio-type-select").click();
  await page.getByRole("option", { name: "Podkast", exact: true }).click();
  await page.waitForURL("**/*audio-type=podcast*");
  const tagButton = page.getByRole("button", { name: "Lydfiltype: Podkast" });
  await expect(tagButton).toBeVisible();
  await expect(page.getByTestId("audio-search-result").first()).toBeVisible();
  expect(Number(await page.getByTestId("searchTotalCount").innerText())).toBeGreaterThanOrEqual(100);
  await tagButton.click();
  await expect(tagButton).not.toBeVisible();
});

test("Can use language dropdown", async ({ page }) => {
  await page.getByTestId("language-select").click();
  await page.getByRole("option", { name: "Engelsk", exact: true }).click();
  await page.waitForURL("**/*language=en*");
  const tagButton = page.getByRole("button", { name: "Språk: Engelsk" });
  await expect(tagButton).toBeVisible();
  await expect(page.getByTestId("audio-search-result").first()).toBeVisible();
  expect(Number(await page.getByTestId("searchTotalCount").innerText())).toBeGreaterThanOrEqual(283);
  await tagButton.click();
  await expect(tagButton).not.toBeVisible();
});
