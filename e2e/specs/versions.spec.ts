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
  await page.goto(`/subject-matter/learning-resource/800/edit/nb`);
});

test("can add notes then save", async ({ page, harCheckpoint }) => {
  await page.getByRole("heading", { name: "Versjonslogg og merknader" }).click();

  await expect(page.locator("table")).toBeVisible();
  const numberOfVersions = await page.locator("table").locator("tr").count();

  await expect(page.getByTestId("addNote")).toBeVisible();
  await page.getByTestId("addNote").click();
  await page.getByTestId("notesInput").click();
  await page.keyboard.type("Test merknad");

  const saveButton = page.getByTestId("saveLearningResourceButtonWrapper").first();

  await expect(saveButton).not.toHaveAttribute("disabled");

  await harCheckpoint();
  await saveButton.click();

  await expect(saveButton).toHaveText("Lagret");

  await expect(page.locator("table")).toBeVisible();

  await expect(page.locator("table").locator("tr")).toHaveCount(numberOfVersions + 1);
});

test("Open previews", async ({ page }) => {
  await page.getByRole("heading", { name: "Versjonslogg og merknader" }).click();
  await page.getByTestId("previewVersion").last().click();
  await page.getByRole("article").first().waitFor();
  await expect(page.getByRole("heading", { name: "Sammenlign med publisert" })).toBeVisible();
  expect(await page.getByRole("article").count()).toBe(2);
  await page.getByRole("button", { name: "Lukk" }).click();
  await expect(page.getByTestId("preview-draft-modal")).toBeVisible({ visible: false });
});

test("Can reset to prod", async ({ page }) => {
  await page.getByRole("heading", { name: "Versjonslogg og merknader" }).click();
  await page.getByTestId("resetToVersion").first().click();
  await expect(page.getByText("Innhold er tilbakestilt")).toBeVisible();
});
