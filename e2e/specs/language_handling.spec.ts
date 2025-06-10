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
  page.goto(`/subject-matter/frontpage-article/800/edit/nb`);
});

test("Can change language and fech new article", async ({ page }) => {
  await page.getByText("Legg til språk").click();
  await page.getByText("Engelsk").click();
  await expect(page.getByText("Engelsk")).toBeVisible();
});

test("Can edit published date", async ({ page }) => {
  await expect(page.locator('[id="editor-save-button"]')).toBeDisabled({ timeout: 10000 });
  const lastUpdatedDate = await page.getByTestId("last-edited").textContent();
  await page.getByTestId("last-edited").click();
  await page.locator('td[data-scope="date-picker"]').first().click();
  const currentSelectedDate = await page.getByTestId("last-edited").textContent();
  expect(lastUpdatedDate === currentSelectedDate).toBeFalsy();
});

test("Has access to html-editor", async ({ page }) => {
  await page.getByTestId("edit-markup-link").waitFor();
  await expect(page.getByTestId("edit-markup-link")).toBeVisible();
});
