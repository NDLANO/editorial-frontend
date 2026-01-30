/**
 * Copyright (c) 2025-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { expect } from "@playwright/test";
import { test } from "../apiMock";

test.beforeEach(async ({ page }) => {
  await page.goto("/subject-matter/learning-resource/new");

  await page.waitForTimeout(300);

  const el = page.getByTestId("slate-editor");
  await el.click();
  await el.getByRole("textbox").focus();
});

test("can insert symbol from toolbar", async ({ page }) => {
  await page.keyboard.type("meow");
  const el = page.getByTestId("slate-editor");
  await el.press("ControlOrMeta+A");
  const toolbarButton = page.getByTestId("toolbar-button-symbol");
  await toolbarButton.waitFor({ state: "visible" });
  await toolbarButton.click();
  const symbol = page.getByTestId("button-half");
  await symbol.waitFor({ state: "visible" });
  await symbol.click();
  await expect(page.getByRole("dialog")).not.toBeVisible();
  await expect(page.getByTestId("slate-editor")).toHaveText(/½.+/);
});

test("can insert symbol using keybind", async ({ page }) => {
  const el = page.getByTestId("slate-editor");
  el.press("ControlOrMeta+Alt+y");
  const symbol = page.getByTestId("button-half");
  await symbol.waitFor({ state: "visible" });
  await symbol.click();
  await expect(page.getByRole("dialog")).not.toBeVisible();
  await expect(page.getByTestId("slate-editor")).toHaveText(/½/);
});
