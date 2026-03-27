/**
 * Copyright (c) 2023-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { expect } from "@playwright/test";
import { test } from "../apiMock";

test.beforeEach(async ({ page, harCheckpoint }) => {
  await page.goto("/search/content");
  await expect(page.getByRole("button", { name: "Søk", exact: true })).toBeVisible();
  await expect(page.getByTestId("loading-spinner")).not.toBeVisible();
  await expect(page.getByTestId("searchTotalCount")).not.toBeEmpty();
  await harCheckpoint();
});

test.afterEach(async ({ page }) => {
  await page.waitForURL("/search/content");
  const count = page.getByTestId("searchTotalCount");
  await expect(count).not.toBeEmpty();
  const amount = await count.innerText();
  expect(Number(amount)).toBeGreaterThanOrEqual(searchTotalCount);
});

const searchTotalCount = 25000;

test("Can use text input", async ({ page }) => {
  await page.locator('input[name="query"]').fill("Test");
  await page.getByRole("button", { name: "Søk", exact: true }).click();
  await page.waitForURL("**/*query=Test*");
  const tagButton = page.getByRole("button", { name: "Søk: Test" });
  await expect(tagButton).toBeVisible();
  await expect(page.getByTestId("content-search-result").first()).toBeVisible();
  expect(Number(await page.getByTestId("searchTotalCount").innerText())).toBeGreaterThanOrEqual(1500);
  await page.locator('input[name="query"]').clear();
  await page.getByRole("button", { name: "Søk", exact: true }).click();
  await expect(tagButton).not.toBeVisible();
});

test("Can use status dropdown", async ({ page }) => {
  await page.getByTestId("draft-status-select").click();
  await page.getByRole("option", { name: "Publisert", exact: true }).click();
  await page.waitForURL("**/*draft-status=PUBLISHED*");
  const tagButton = page.getByRole("button", { name: "Status: Publisert" });
  await expect(tagButton).toBeVisible();
  await expect(page.getByTestId("content-search-result").first()).toBeVisible();
  expect(Number(await page.getByTestId("searchTotalCount").innerText())).toBeGreaterThanOrEqual(21000);
  await page.getByTestId("remove-tag-button").click();
  await expect(tagButton).not.toBeVisible();
});

test("Can use language dropdown", async ({ page }) => {
  await page.getByTestId("language-select").click();
  await page.getByRole("option", { name: "Bokmål", exact: true }).click();
  await page.waitForURL("**/*language=nb*");
  const tagButton = page.getByRole("button", { name: "Språk: Bokmål" });
  await expect(tagButton).toBeVisible();
  await expect(page.getByTestId("content-search-result").first()).toBeVisible();
  expect(Number(await page.getByTestId("searchTotalCount").innerText())).toBeGreaterThanOrEqual(24000);
  await page.getByTestId("remove-tag-button").click();
  await expect(tagButton).not.toBeVisible();
});

test("Can use subject dropdown", async ({ page }) => {
  await page.getByTestId("subjects-select").click();
  await page.getByRole("option", { name: "Biologi 1", exact: true }).click();
  await page.waitForURL("**/*subjects=urn%3Asubject%3A1%3A83ce68bc-19c9-4f2b-8dba-caf401428f21*");
  const tagButton = page.getByRole("button", { name: "Fag: Biologi 1" });
  await expect(tagButton).toBeVisible();
  await expect(page.getByTestId("content-search-result").first()).toBeVisible();
  expect(Number(await page.getByTestId("searchTotalCount").innerText())).toBeGreaterThanOrEqual(500);
  await page.getByTestId("remove-tag-button").click();
  await expect(page.getByTestId("remove-tag-button")).not.toBeVisible();
  await expect(tagButton).not.toBeVisible();
});

test("Can use responsible dropdown", async ({ page }) => {
  await page.getByTestId("responsible-ids-select").click();
  await expect(page.getByRole("option", { name: "Ed Test", exact: true })).toBeVisible();
  await page.getByRole("option", { name: "Ed Test", exact: true }).click();
  await page.waitForURL("**/*responsible-ids=Gxfx7B-MXoFdgVZZ6p611C6w*");
  const tagButton = page.getByRole("button", { name: "Ansvarlig: Ed Test" });
  await expect(tagButton).toBeVisible();
  await expect(page.getByTestId("content-search-result").first()).toBeVisible();
  expect(Number(await page.getByTestId("searchTotalCount").innerText())).toBeGreaterThanOrEqual(30);
  await page.getByTestId("remove-tag-button").click();
  await expect(tagButton).not.toBeVisible();
});

test("Can use content type dropdown", async ({ page }) => {
  await page.getByTestId("resource-types-select").click();
  await page.getByRole("option", { name: "Fagstoff", exact: true }).click();
  await page.waitForURL("**/*resource-types=urn%3Aresourcetype%3AsubjectMaterial*");
  const tagButton = page.getByRole("button", { name: "Innholdstype: Fagstoff" });
  await expect(tagButton).toBeVisible();
  await expect(page.getByTestId("content-search-result").first()).toBeVisible();
  expect(Number(await page.getByTestId("searchTotalCount").innerText())).toBeGreaterThanOrEqual(9900);
  await page.getByTestId("remove-tag-button").click();
  await expect(tagButton).not.toBeVisible();
});

test("Can use trait dropdown", async ({ page }) => {
  await page.getByTestId("traits-select").click();
  await page.getByRole("option", { name: "Video", exact: true }).click();
  await page.waitForURL("**/*traits=VIDEO*");
  const tagButton = page.getByRole("button", { name: "Egenskap: Video" });
  await expect(tagButton).toBeVisible();
  await expect(page.getByTestId("content-search-result").first()).toBeVisible();
  expect(Number(await page.getByTestId("searchTotalCount").innerText())).toBeGreaterThanOrEqual(7500);
  await page.getByTestId("remove-tag-button").click();
  await expect(tagButton).not.toBeVisible();
});

test("Can use searchfield dropdown", async ({ page }) => {
  await page.locator('input[name="query"]').fill("Test");
  await page.getByRole("button", { name: "Søk", exact: true }).click();
  await page.getByTestId("query-fields-select").click();
  await page.getByRole("option", { name: "Tittel", exact: true }).click();
  await page.getByRole("option", { name: "Ingress", exact: true }).click();
  await page.getByTestId("query-fields-select").click();
  await page.waitForURL("**/*query-fields=title%2Cintroduction*");
  const queryButton = page.getByRole("button", { name: "Søk: Test" });
  const titleButton = page.getByRole("button", { name: "Søkefelt: Tittel" });
  const introButton = page.getByRole("button", { name: "Søkefelt: Ingress" });
  await expect(queryButton).toBeVisible();
  await expect(titleButton).toBeVisible();
  await expect(introButton).toBeVisible();
  await expect(page.getByTestId("content-search-result").first()).toBeVisible();
  expect(Number(await page.getByTestId("searchTotalCount").innerText())).toBeGreaterThanOrEqual(1400);
  await queryButton.click();
  await titleButton.click();
  await introButton.click();
  await expect(queryButton).not.toBeVisible();
  await expect(titleButton).not.toBeVisible();
  await expect(introButton).not.toBeVisible();
});
