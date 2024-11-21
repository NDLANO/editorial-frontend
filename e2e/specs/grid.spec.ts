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
  await page.mouse.wheel(0, 50);
  await page.getByTestId("slate-block-picker").click();
  await page.getByTestId("create-grid").click();
});

test("can select multiple different sizes", async ({ page }) => {
  expect(await page.getByTestId("slate-grid-cell").count()).toEqual(2);
  await page.getByTestId("edit-grid-button").click();
  await page.getByRole("radiogroup").getByText("4").click();
  await page.getByTestId("grid-form-save-button").click();
  expect(await page.getByTestId("slate-grid-cell").count()).toEqual(4);
  await page.getByTestId("edit-grid-button").click();
  await page.getByRole("radiogroup").getByText("2x2").click();
  await page.getByTestId("grid-form-save-button").click();
  expect(await page.getByTestId("slate-grid-cell").count()).toEqual(4);
  await page.getByTestId("edit-grid-button").click();
  await page.getByRole("radiogroup").getByText("2", { exact: true }).click();
  await page.getByTestId("grid-form-save-button").click();
  expect(await page.getByTestId("slate-grid-cell").count()).toEqual(2);
});

test("can change background color", async ({ page }) => {
  await page.getByTestId("edit-grid-button").click();
  await page.getByText("Hvit").click();
  await page.getByTestId("grid-form-save-button").click();
});

test("can set border", async ({ page }) => {
  await page.getByTestId("edit-grid-button").click();
  let checkbox = page.locator('[data-scope="checkbox"][data-part="root"]');
  await checkbox.click();
  await page.getByTestId("grid-form-save-button").click();

  await page.getByTestId("edit-grid-button").click();
  checkbox = page.locator('[data-scope="checkbox"][data-part="root"][data-state="checked"]');
  await expect(checkbox).toBeVisible();
});

test("can enable parallax on cells", async ({ page }) => {
  expect(await page.getByTestId("grid-cell-parallax").count()).toEqual(2);
  await expect(page.getByTitle("Lås innhold til cellen ved siden av", { exact: true }).first()).toBeVisible();
  await page.getByTitle("Lås innhold til cellen ved siden av", { exact: true }).first().click();
  await expect(page.getByTitle("Frigjør innhold fra cellen ved siden av", { exact: true }).first()).toBeVisible();
});
