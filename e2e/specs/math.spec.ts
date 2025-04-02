/**
 * Copyright (c) 2023-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { expect } from "@playwright/test";
import { test } from "../apiMock";

const metaKey = process.platform === "darwin" ? "Meta" : "Control";

test.beforeEach(async ({ page }) => {
  await page.goto("/subject-matter/learning-resource/new");

  await page.waitForTimeout(300);

  const el = page.getByTestId("slate-editor");
  await el.click();
  await el.getByRole("textbox").fill("111+1");
  await el.press(`${metaKey}+A`);
  const mathButton = page.getByTestId("toolbar-button-mathml");
  await mathButton.waitFor({ state: "visible" });
  await mathButton.click();
});

test("contains text from slate editor", async ({ page }) => {
  const mathEditor = page.getByRole("dialog").getByRole("application");
  await mathEditor.waitFor({ state: "visible" });
  await mathEditor.locator(".wrs_panelContainer").waitFor({ state: "visible" });
  const textContent = await mathEditor.locator(".wrs_container").textContent();
  expect(textContent?.slice(1)).toEqual("111+1");
  await page.getByTestId("save-math").click();
  await expect(page.getByRole("dialog")).not.toBeVisible();
});

test("can change text and save", async ({ page }) => {
  const mathEditor = page.getByRole("dialog").getByRole("application");
  await mathEditor.waitFor({ state: "visible" });
  await mathEditor.locator(".wrs_panelContainer").waitFor({ state: "visible" });
  const mathInput = mathEditor.locator(".wrs_focusElement");
  await mathInput.click();
  await expect(mathInput).toBeFocused();
  await page.keyboard.type("=112");
  await page.getByTestId("save-math").click();
  await expect(page.getByRole("dialog")).not.toBeVisible();
  expect(await page.getByTestId("math").textContent()).toEqual("111+1=112");
});

test("can change preview when preview button pressed", async ({ page }) => {
  const mathEditor = page.getByRole("dialog").getByRole("application");
  await mathEditor.waitFor({ state: "visible" });
  await mathEditor.locator(".wrs_panelContainer").waitFor({ state: "visible" });
  const textContent = await page.getByTestId("math-preview").textContent();
  expect(textContent).toEqual("111+1");
  const mathInput = mathEditor.locator(".wrs_focusElement");
  await mathInput.click();
  await expect(mathInput).toBeFocused();
  await page.keyboard.type("=112");
  await page.getByTestId("preview-math").click();
  expect(await page.getByTestId("math-preview").textContent()).toEqual("111+1=112");
  await page.getByTestId("save-math").click();
  await expect(page.getByRole("dialog")).not.toBeVisible();
});

test("can provide modal when leaving unchecked edits", async ({ page }) => {
  const mathEditor = page.getByRole("dialog").getByRole("application");
  await mathEditor.waitFor({ state: "visible" });
  await mathEditor.locator(".wrs_panelContainer").waitFor({ state: "visible" });
  await mathEditor.locator('[class="wrs_focusElementContainer"]').getByRole("textbox").click();
  const mathInput = mathEditor.locator(".wrs_focusElement");
  await mathInput.click();
  await expect(mathInput).toBeFocused();
  await page.keyboard.type("=112");
  await page.getByRole("button", { name: "Lukk" }).click();
  const alertDialog = page.getByTestId("alert-dialog");
  await alertDialog.waitFor({ state: "visible" });
  await expect(alertDialog).toBeVisible();
  await alertDialog.getByRole("button", { name: "Fortsett" }).click();
  await expect(page.getByRole("dialog")).not.toBeVisible();
});
