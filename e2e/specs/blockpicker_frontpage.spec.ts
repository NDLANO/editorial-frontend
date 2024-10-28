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
  await page.goto("/subject-matter/frontpage-article/new");
  const el = page.getByTestId("slate-editor");
  await el.click();
  await page.getByTestId("slate-block-picker").click();
  await expect(page.getByTestId("slate-block-picker-menu")).toBeVisible();
});

test("adds and removes grid", async ({ page }) => {
  await page.mouse.wheel(0, 50);
  await page.getByTestId("create-grid").click();
  await expect(page.getByTestId("slate-grid-cell")).toHaveCount(2);
  await page.getByTestId("slate-grid-cell").first().click();
  await page.getByTestId("slate-block-picker").click();
  await expect(page.getByTestId("create-keyFigure")).toBeVisible();
  await expect(page.getByTestId("create-image")).toBeVisible();
  await expect(page.getByTestId("create-pitch")).toBeVisible();
  await expect(page.getByTestId("slate-block-picker-menu").getByRole("button")).toHaveCount(6);
  await expect(page.getByTestId("remove-grid")).toBeVisible();
  await page.getByTestId("remove-grid").click();
  await expect(page.getByTestId("remove-grid")).toHaveCount(0);
});

test("adds and removes keyfigure", async ({ page }) => {
  await page.getByTestId("create-keyFigure").click();
  await expect(
    page.locator('div[data-part="content"]').getByRole("button", { name: "Lagre", exact: true }),
  ).toBeDisabled();
  const modal = page.locator('div[role="dialog"]');
  await modal.locator("div[name='title']").fill("test");
  await modal.locator("div[name='subtitle']").fill("test");
  await page.getByTestId("select-image-from-list").first().click();
  await page.getByTestId("use-image").click();
  await expect(
    page.locator('div[data-part="content"]').getByRole("button", { name: "Lagre", exact: true }),
  ).toBeEnabled();
  await page.getByRole("dialog").getByRole("button", { name: "Lagre", exact: true }).dispatchEvent("click");
  await expect(page.getByTestId("slate-key-figure")).toBeVisible();
  await page.getByTestId("remove-key-figure").click();
  await expect(page.getByTestId("slate-key-figure")).toHaveCount(0);
});

test("adds and removes pitch", async ({ page }) => {
  await page.getByTestId("create-grid").click();
  await expect(page.getByTestId("slate-grid-cell")).toHaveCount(2);
  await page.getByTestId("slate-grid-cell").first().click();
  await page.getByTestId("slate-block-picker").click();
  await page.getByTestId("create-pitch").click();
  await expect(
    page.locator('div[data-part="content"]').getByRole("button", { name: "Lagre", exact: true }),
  ).toBeDisabled();
  const modal = page.locator('div[role="dialog"]');
  await modal.locator("div[name='title']").fill("test");
  await modal.locator("div[name='description']").fill("test");
  await page.getByTestId("select-image-from-list").first().click();
  await page.getByTestId("use-image").click();
  await modal.locator("input[name='link']").fill("https://test.test");
  await expect(
    page.locator('div[data-part="content"]').getByRole("button", { name: "Lagre", exact: true }),
  ).toBeEnabled();
  await page.getByRole("dialog").getByRole("button", { name: "Lagre", exact: true }).dispatchEvent("click");
  await expect(page.getByTestId("slate-pitch")).toBeVisible();
  await page.getByTestId("remove-pitch").click();
  await expect(page.getByTestId("slate-pitch")).toHaveCount(0);
});

test("adds and removes contactblock", async ({ page }) => {
  await page.getByTestId("create-contactBlock").click();
  await expect(
    page.locator('div[data-part="content"]').getByRole("button", { name: "Lagre", exact: true }),
  ).toBeDisabled();
  await page.locator("input[name='name']").fill("test");
  await page.locator("input[name='jobTitle']").fill("test");
  await page.locator("input[name='email']").fill("email@email.no");
  await page.locator("textarea[name='description']").fill("email");
  await page.getByTestId("select-image-from-list").first().click();
  await page.getByTestId("use-image").click();
  await expect(
    page.locator('div[data-part="content"]').getByRole("button", { name: "Lagre", exact: true }),
  ).toBeEnabled();
  await page.getByRole("dialog").getByRole("button", { name: "Lagre", exact: true }).dispatchEvent("click");
  await expect(page.getByTestId("slate-contact-block")).toBeVisible();
  await page.getByTestId("remove-contact-block").click();
  await expect(page.getByTestId("slate-contact-block")).toHaveCount(0);
});

test("adds and removes campaignblock", async ({ page }) => {
  await page.getByTestId("create-campaignBlock").click();
  await expect(
    page.locator('div[data-part="content"]').getByRole("button", { name: "Lagre", exact: true }),
  ).toBeDisabled();
  const modal = page.locator('div[role="dialog"]');
  await modal.locator("div[name='title']").fill("test");
  await modal.locator("div[name='description']").fill("test");
  await page.locator("input[name='link']").fill("https://test.test");
  await modal.locator("div[name='linkText']").fill("Test page");
  await page.getByTestId("select-image-from-list").first().click();
  await page.getByTestId("use-image").click();
  await expect(
    page.locator('div[data-part="content"]').getByRole("button", { name: "Lagre", exact: true }),
  ).toBeEnabled();
  await page.getByRole("dialog").getByRole("button", { name: "Lagre", exact: true }).dispatchEvent("click");
  await expect(page.getByTestId("slate-campaign-block")).toBeVisible();
  await page.getByTestId("remove-campaign-block").click();
  await expect(page.getByTestId("slate-campaign-block")).toHaveCount(0);
});
