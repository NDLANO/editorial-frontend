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

  const el = page.getByTestId("slate-editor");
  await el.click();
  await page.keyboard.type("111+1");
  await el.press(`${metaKey}+A`);
  await page.getByTestId("toolbar-button-mathml").click();
});

test("editor is visible", async ({ page }) => {
  const mathEditor = page.getByRole("dialog").getByRole("application");
  await mathEditor.waitFor();
  await expect(mathEditor).toBeVisible();
});

test("contains text from slate editor", async ({ page }) => {
  const mathEditor = page.getByRole("dialog").getByRole("application");
  await mathEditor.waitFor();
  await mathEditor.locator('[class="wrs_container"]').waitFor();
  expect((await mathEditor.locator('[class="wrs_container"]').textContent())?.slice(1)).toEqual("111+1");
});

test("can change text and save", async ({ page }) => {
  const mathEditor = page.getByRole("dialog").getByRole("application");
  await mathEditor.waitFor();
  await mathEditor.locator('[class="wrs_focusElementContainer"]').getByRole("textbox").click();
  await page.keyboard.type("=112");
  await page.getByTestId("save-math").click();
  expect(await page.getByTestId("math").textContent()).toEqual("111+1=112");
});

test("can change preview when preview button pressed", async ({ page }) => {
  const mathEditor = page.getByRole("dialog").getByRole("application");
  await mathEditor.waitFor();
  expect(await page.getByTestId("preview-math-text").textContent()).toEqual("111+1");
  await mathEditor.locator('[class="wrs_focusElementContainer"]').getByRole("textbox").click();
  await page.keyboard.type("=112");
  await page.getByTestId("preview-math").click();
  expect(await page.getByTestId("preview-math-text").textContent()).toEqual("111+1=112");
});

test("can provide modal when leaving unchecked edits", async ({ page }) => {
  const mathEditor = page.getByRole("dialog").getByRole("application");
  await mathEditor.waitFor();
  await mathEditor.locator('[class="wrs_focusElementContainer"]').getByRole("textbox").click();
  await page.keyboard.type("=112");
  await page.getByRole("button", { name: "Lukk" }).click();
  await expect(page.getByTestId("alert-dialog")).toBeVisible();
});
