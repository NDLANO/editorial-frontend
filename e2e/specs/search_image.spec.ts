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
  await page.goto("/search/image");
  await expect(page.getByRole("button", { name: "Søk", exact: true })).toBeVisible();
  await expect(page.getByTestId("loading-spinner")).not.toBeVisible();
});

test.afterEach(async ({ page }) => {
  await page.waitForURL("/search/image");
  const count = page.getByTestId("searchTotalCount");
  await expect(count).not.toBeEmpty();
  const amount = await count.innerText();
  expect(Number(amount)).toBeGreaterThanOrEqual(totalSearchCount);
});

const totalSearchCount = 69084;

test("Can use text input", async ({ page }) => {
  await page.locator('input[name="query"]').fill("Test");
  await page.getByRole("button", { name: "Søk", exact: true }).click();
  await page.waitForURL("**/*query=Test*");
  const tagButton = page.getByRole("button", { name: "Søk: Test" });
  await expect(tagButton).toBeVisible();
  await expect(page.getByTestId("image-search-result").first()).toBeVisible();
  expect(Number(await page.getByTestId("searchTotalCount").innerText())).toBeGreaterThanOrEqual(400);
  await page.locator('input[name="query"]').clear();
  await page.getByRole("button", { name: "Søk", exact: true }).click();
  await expect(tagButton).not.toBeVisible();
});

test("Can use model released dropdown", async ({ page }) => {
  await page.getByTestId("model-released-select").click();
  await page.getByRole("option", { name: "Modellklarert", exact: true }).click();
  await page.waitForURL("**/*model-released=yes*");
  const tagButton = page.getByRole("button", { name: "Modellklarering: Modellklarert" });
  await expect(tagButton).toBeVisible();
  await expect(page.getByTestId("image-search-result").first()).toBeVisible();
  expect(Number(await page.getByTestId("searchTotalCount").innerText())).toBeGreaterThanOrEqual(2200);
  await tagButton.click();
  await expect(tagButton).not.toBeVisible();
});

test("Can use language dropdown", async ({ page }) => {
  await page.getByTestId("language-select").click();
  await page.getByRole("option", { name: "Bokmål", exact: true }).click();
  await page.waitForURL("**/*language=nb*");
  const tagButton = page.getByRole("button", { name: "Språk: Bokmål" });
  await expect(tagButton).toBeVisible();
  await expect(page.getByTestId("image-search-result").first()).toBeVisible();
  expect(Number(await page.getByTestId("searchTotalCount").innerText())).toBeGreaterThanOrEqual(26000);
  await tagButton.click();
  await expect(tagButton).not.toBeVisible();
});

test("Can use license dropdown", async ({ page }) => {
  await page.getByTestId("license-select").click();
  await page.getByRole("option", { name: "CC0 Public domain dedication: Gitt til fellesskapet", exact: true }).click();
  await page.waitForURL("**/*license=CC0-1.0*");
  const tagButton = page.getByRole("button", { name: "Lisens: CC0 Public" });
  await expect(tagButton).toBeVisible();
  await expect(page.getByTestId("image-search-result").first()).toBeVisible();
  expect(Number(await page.getByTestId("searchTotalCount").innerText())).toBeGreaterThanOrEqual(900);
  await tagButton.click();
  await expect(tagButton).not.toBeVisible();
});
