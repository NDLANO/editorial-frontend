/**
 * Copyright (c) 2024-present, NDLA.
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
  await page.getByTestId("create-disclaimer").click();
});

test("update disclaimer text", async ({ page }) => {
  const newDisclaimerText = "This is a new disclaimer text";
  await page.getByTestId("disclaimer-editor").click();
  await page.keyboard.type(newDisclaimerText);
  await page.getByTestId("disclaimer-save").click();
  await page.getByLabel("Tilgjengelighet", { exact: true }).click();
  await expect(page.getByText(newDisclaimerText, { exact: true })).toBeVisible();
});

test("add content to disclaimer", async ({ page }) => {
  await page.getByTestId("disclaimer-editor").click();
  await page.keyboard.type("Test disclaimer");
  await page.getByTestId("disclaimer-save").click();
  await page.locator("[data-uu-content]").click();
  await page.getByTestId("slate-block-picker").click();
  await page.getByTestId("create-image").click();
  await page.getByTestId("select-image-from-list").first().click();
  await page.getByTestId("use-image").click();
  await expect(page.getByTestId("remove-element")).toBeVisible();
});

test("move content out of disclaimer", async ({ page }) => {
  await page.getByTestId("disclaimer-editor").click();
  await page.keyboard.type("Test disclaimer");
  await page.getByTestId("disclaimer-save").click();
  await page.locator("[data-uu-content]").click();
  await page.getByTestId("slate-block-picker").click();
  await page.getByTestId("create-image").click();
  await page.getByTestId("select-image-from-list").first().click();
  await page.getByTestId("use-image").click();
  await expect(page.getByTestId("remove-element")).toBeVisible();
  await expect(page.getByTestId("move-disclaimer")).toBeAttached();
  await page.getByTestId("move-disclaimer").click();
  await expect(page.getByTestId("remove-element")).toBeVisible();
});

test("delete disclaimer with content", async ({ page }) => {
  await page.getByTestId("disclaimer-editor").click();
  await page.keyboard.type("Test disclaimer");
  await page.getByTestId("disclaimer-save").click();
  await page.locator("[data-uu-content]").click();
  await page.getByTestId("slate-block-picker").click();
  await page.getByTestId("create-image").click();
  await page.getByTestId("select-image-from-list").first().click();
  await page.getByTestId("use-image").click();
  await expect(page.getByTestId("remove-element")).toBeVisible();
  await expect(page.getByTestId("delete-disclaimer")).toBeVisible();
  await page.getByTestId("delete-disclaimer").click();
  await expect(page.getByTestId("remove-element")).toHaveCount(0);
});
