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
  await page.goto("/subject-matter/learning-resource/800/edit/nb");
});

test("can change status correctly", async ({ page, harCheckpoint }) => {
  const statusSelect = page.getByTestId("status-select");
  const saveButton = page.getByTestId("saveLearningResourceButtonWrapper").getByRole("button").first();

  await statusSelect.click();
  await page.getByText("I arbeid", { exact: true }).first().click();
  await page.getByTestId("responsible-select").click();
  await page.keyboard.type("Ed test");
  await page.keyboard.press("ArrowDown");
  await page.keyboard.press("Enter");

  await harCheckpoint();
  await saveButton.click();
  await saveButton.getByText("Lagret").waitFor();
  await expect(statusSelect.locator('[data-part="value-text"]')).toHaveText("I arbeid");

  await statusSelect.click();
  await page.getByText("Sisteblikk", { exact: true }).click();
  await harCheckpoint();
  await saveButton.click();
  await saveButton.getByText("Lagret").waitFor();
  await expect(statusSelect.locator('[data-part="value-text"]')).toHaveText("Sisteblikk");

  await statusSelect.click();
  await harCheckpoint();
  await page.getByText("Publiser", { exact: true }).click();
  await saveButton.getByText("Lagret").waitFor();
  await expect(statusSelect.locator('[data-part="value-text"]')).toHaveText("Publisert");
});
