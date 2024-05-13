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
  await page.goto("/concept/1/edit/nb");
});

test("Can change language and fetch new concept", async ({ page }) => {
  await page.getByRole("button").getByText("Legg til språk").click();
  await page.getByText("Engelsk").click();

  await expect(page.getByText("Engelsk")).toBeVisible();
});
