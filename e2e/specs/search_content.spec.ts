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

const searchTotalCount = 25000;

test("Can use text input", async ({ page }) => {
  await page.locator('input[name="query"]').fill("Test");
  await page.getByRole("button", { name: "Søk", exact: true }).click();
  await page.getByTestId("content-search-result").first().waitFor();
  expect(Number(await page.getByTestId("searchTotalCount").innerText())).toBeGreaterThanOrEqual(1500);
  await page.locator('input[name="query"]').clear();
  await page.getByRole("button", { name: "Søk", exact: true }).click();
  await page.getByTestId("content-search-result").first().waitFor();
  expect(Number(await page.getByTestId("searchTotalCount").innerText())).toBeGreaterThanOrEqual(searchTotalCount);
});

test("Can use status dropdown", async ({ page }) => {
  await page.getByTestId("draft-status-select").click();
  await page.getByRole("option", { name: "Publisert", exact: true }).click();
  await page.getByTestId("content-search-result").first().waitFor();
  expect(Number(await page.getByTestId("searchTotalCount").innerText())).toBeGreaterThanOrEqual(21500);
  await page.getByTestId("remove-tag-button").click();
  await page.getByTestId("content-search-result").first().waitFor();
  expect(Number(await page.getByTestId("searchTotalCount").innerText())).toBeGreaterThanOrEqual(searchTotalCount);
});

test("Can use language dropdown", async ({ page }) => {
  await page.getByTestId("language-select").click();
  await page.getByRole("option", { name: "Bokmål", exact: true }).click();
  await page.getByTestId("content-search-result").first().waitFor();
  expect(Number(await page.getByTestId("searchTotalCount").innerText())).toBeGreaterThanOrEqual(24000);
  await page.getByTestId("remove-tag-button").click();
  await page.getByTestId("content-search-result").first().waitFor();
  expect(Number(await page.getByTestId("searchTotalCount").innerText())).toBeGreaterThanOrEqual(searchTotalCount);
});

test("Can use subject dropdown", async ({ page }) => {
  await page.getByTestId("subjects-select").click();
  await page.getByRole("option", { name: "Biologi 1", exact: true }).click();
  await page.getByTestId("content-search-result").first().waitFor();
  expect(Number(await page.getByTestId("searchTotalCount").innerText())).toBeGreaterThanOrEqual(600);
  await page.getByTestId("remove-tag-button").click();
  await page.getByTestId("content-search-result").first().waitFor();
  expect(Number(await page.getByTestId("searchTotalCount").innerText())).toBeGreaterThanOrEqual(searchTotalCount);
});

test("Can use responsible dropdown", async ({ page }) => {
  await page.getByTestId("responsible-ids-select").click();
  await page.getByRole("option", { name: "Ed Test", exact: true }).click();
  await page.getByTestId("content-search-result").first().waitFor();
  expect(Number(await page.getByTestId("searchTotalCount").innerText())).toBeGreaterThanOrEqual(30);
  await page.getByTestId("remove-tag-button").click();
  await page.getByTestId("content-search-result").first().waitFor();
  expect(Number(await page.getByTestId("searchTotalCount").innerText())).toBeGreaterThanOrEqual(searchTotalCount);
});

test("Can use user dropdown", async ({ page }) => {
  await page.getByTestId("users-select").click();
  await page.getByRole("option", { name: "Ed Test", exact: true }).click();
  await page.getByTestId("content-search-result").first().waitFor();
  expect(Number(await page.getByTestId("searchTotalCount").innerText())).toBeGreaterThanOrEqual(100);
  await page.getByTestId("remove-tag-button").click();
  await page.getByTestId("content-search-result").first().waitFor();
  expect(Number(await page.getByTestId("searchTotalCount").innerText())).toBeGreaterThanOrEqual(searchTotalCount);
});

test("Can use content type dropdown", async ({ page }) => {
  await page.getByTestId("resource-types-select").click();
  await page.getByRole("option", { name: "Arbeidsoppdrag", exact: true }).click();
  await page.getByTestId("content-search-result").first().waitFor();
  expect(Number(await page.getByTestId("searchTotalCount").innerText())).toBeGreaterThanOrEqual(500);
  await page.getByTestId("remove-tag-button").click();
  await page.getByTestId("content-search-result").first().waitFor();
  expect(Number(await page.getByTestId("searchTotalCount").innerText())).toBeGreaterThanOrEqual(searchTotalCount);
});

test("Can use inactive checkbox", async ({ page }) => {
  await page.locator("label", { hasText: "Inkluder utgåtte fag" }).click();
  await page.getByTestId("content-search-result").first().waitFor();
  expect(Number(await page.getByTestId("searchTotalCount").innerText())).toBeGreaterThanOrEqual(40000);
  await page.locator("label", { hasText: "Inkluder utgåtte fag" }).click();
  await page.getByTestId("content-search-result").first().waitFor();
  expect(Number(await page.getByTestId("searchTotalCount").innerText())).toBeGreaterThanOrEqual(searchTotalCount);
});

test("Can use exclude checkbox", async ({ page }) => {
  await page.locator("label", { hasText: "Ekskluder endringslogg" }).click();
  await page.getByTestId("content-search-result").first().waitFor();
  expect(Number(await page.getByTestId("searchTotalCount").innerText())).toBeGreaterThanOrEqual(searchTotalCount);
  await page.locator("label", { hasText: "Ekskluder endringslogg" }).click();
  await page.getByTestId("content-search-result").first().waitFor();
  expect(Number(await page.getByTestId("searchTotalCount").innerText())).toBeGreaterThanOrEqual(searchTotalCount);
});
