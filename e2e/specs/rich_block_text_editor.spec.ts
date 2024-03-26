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

test("can enter title, ingress, content and responsible then save", async ({ page }) => {
  const saveButton = page.getByTestId("saveLearningResourceButtonWrapper").getByRole("button").first();

  await expect(saveButton).toBeDisabled();
  await page.getByTestId("learning-resource-title").click();
  await page.keyboard.type("TITTEL");
  await page.getByTestId("learning-resource-ingress").click();
  await page.keyboard.type("INGRESS");
  await page.getByTestId("slate-editor").click({ position: { x: 0, y: 0 } });
  await page.keyboard.type("CONTENT");
  await page.getByTestId("responsible-select").click();
  await page.keyboard.type("Test user");
  await page.keyboard.press("Enter");
  await saveButton.click();
  await expect(saveButton).toContainText("Lagret");
});

test("Can add all contributors", async ({ page }) => {
  await page.getByRole("heading").getByRole("button").getByText("Lisens og bruker").click();
  const fieldSets = await page.getByTestId("contributor-fieldset").all();
  const contributorValues = ["originator", "rightsholder", "processor"];
  let index = 0;
  for (const fieldSet of fieldSets) {
    await fieldSet.getByTestId("addContributor").click();
    await page.keyboard.type("Test user");
    const lastSelect = fieldSet.getByTestId("contributor-selector").last();
    await lastSelect.selectOption(contributorValues[index]);
    await expect(lastSelect).not.toHaveAttribute("aria-invalid");
    await expect(lastSelect).toHaveValue(contributorValues[index]);
    index++;
  }
});
