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
  await page.goto("/subject-matter/learning-resource/new");
  await page.getByTestId("slate-editor").click();
  await page.getByTestId("slate-block-picker").click();
  await page.getByTestId("create-table").click();
});

test("can fill table caption", async ({ page }) => {
  await page.locator("caption").click();
  await page.keyboard.type("TITTEL!");
  await expect(page.locator("caption")).toHaveText("TITTEL!");
});

test("can move around and place text in table", async ({ page }) => {
  expect(await page.locator("th").count()).toEqual(2);
  expect(await page.locator("td").count()).toEqual(2);
  expect(await page.locator("tr").count()).toEqual(2);
  await page.locator("tbody > tr > td").first().fill("Cell");
  await page.locator("thead > tr > th").first().click();
  const firstHeader = page.locator("thead > tr > th").first();
  const lastHeader = page.locator("thead > tr > th").last();
  await firstHeader.fill("Header 1");
  await lastHeader.focus();
  await page.keyboard.press("End");
  await page.keyboard.press("ArrowRight");
  await lastHeader.fill("Header 2");
  await expect(page.locator("thead > tr > th").first()).toHaveText("Header 1");
  await expect(page.locator("thead > tr > th").last()).toHaveText("Header 2");
  await page.getByTestId("column-add").click();
  expect(await page.locator("th").count()).toEqual(3);
  expect(await page.locator("td").count()).toEqual(3);

  await page.locator("thead > tr > th").last().click();
  await page.keyboard.type("Test new header");
  await page.keyboard.press("ArrowDown");
  await page.getByTestId("row-add").click();
  await page.locator("tbody > tr > td").last().click();
  expect(await page.locator("tr").count()).toEqual(3);
  expect(await page.locator("td").count()).toEqual(6);
  await page.keyboard.type("Test new row");
  await page.getByTestId("toggle-row-headers").click();
  expect(await page.locator("th").count()).toEqual(5);
  expect(await page.locator("td").count()).toEqual(4);
  await page.getByTestId("column-remove").click();
  expect(await page.locator("th").count()).toEqual(4);
  expect(await page.locator("td").count()).toEqual(2);
  await page.getByTestId("row-remove").click();
  expect(await page.locator("tr").count()).toEqual(2);
});

test("can add rows and columns", async ({ page }) => {
  await page.locator("thead > tr > th").last().click();
  await page.keyboard.type("Test new header");
  await page.keyboard.press("ArrowDown");
  await page.getByTestId("row-add").click();
  await page.locator("tbody > tr > td").last().click();
  expect(await page.locator("tr").count()).toEqual(3);
  expect(await page.locator("td").count()).toEqual(4);
  await page.keyboard.type("Test new row");
  await page.getByTestId("toggle-row-headers").click();
  expect(await page.locator("th").count()).toEqual(4);
  expect(await page.locator("td").count()).toEqual(2);
  await page.getByTestId("column-remove").click();
  expect(await page.locator("th").count()).toEqual(3);
  expect(await page.locator("td").count()).toEqual(0);
  await page.getByTestId("row-remove").click();
  expect(await page.locator("tr").count()).toEqual(2);
});

test("can remove and add table headers", async ({ page }) => {
  expect(await page.locator("th").count()).toEqual(2);
  expect(await page.locator("td").count()).toEqual(2);
  expect(await page.locator("tr").count()).toEqual(2);
  await page.locator("thead > tr > th").first().click();
  await page.getByTestId("row-remove").click();
  expect(await page.locator("th").count()).toEqual(0);
  expect(await page.locator("td").count()).toEqual(2);
  expect(await page.locator("tr").count()).toEqual(1);
  await page.getByTestId("head-add").click();
  expect(await page.locator("th").count()).toEqual(2);
  expect(await page.locator("td").count()).toEqual(2);
  expect(await page.locator("tr").count()).toEqual(2);
});

test("can toggle row headers", async ({ page }) => {
  expect(await page.locator("th").count()).toEqual(2);
  expect(await page.locator("td").count()).toEqual(2);
  expect(await page.locator("tr").count()).toEqual(2);
  await page.locator("tbody > tr > td").first().click();
  await page.getByTestId("toggle-row-headers").click();
  expect(await page.locator("th").count()).toEqual(3);
  expect(await page.locator("td").count()).toEqual(1);
  expect(await page.locator("tr").count()).toEqual(2);
});

test("blockpicker to give limited options in table", async ({ page }) => {
  await page.locator("thead > tr > th").first().click();
  expect(page.getByTestId("slate-block-picker")).toBeVisible({ visible: false });

  await page.locator("tbody > tr > td").first().click();
  await expect(page.getByTestId("slate-block-picker")).toBeVisible();
  await page.getByTestId("slate-block-picker").click();
  await expect(page.getByTestId("create-image")).toBeVisible();
  expect(await page.getByTestId("slate-block-picker-menu").getByRole("button").count()).toEqual(1);
});
