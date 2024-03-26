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
  expect(await page.getByTestId("slate-grid-cell").count()).toEqual(2);
  await page.getByTestId("slate-grid-cell").first().click();
  await page.getByTestId("slate-block-picker").click();
  await expect(page.getByTestId("create-keyFigure")).toBeVisible();
  await expect(page.getByTestId("create-image")).toBeVisible();
  await expect(page.getByTestId("create-blogPost")).toBeVisible();
  expect(await page.getByTestId("slate-block-picker-menu").getByRole("button").count()).toEqual(6);
  await expect(page.getByTestId("remove-grid")).toBeVisible();
  await page.getByTestId("remove-grid").click();
  await expect(page.getByTestId("remove-grid")).toHaveCount(0);
});

test("adds and removes keyfigure", async ({ page }) => {
  await page.getByTestId("create-keyFigure").click();
  await expect(page.getByRole("button", { name: "Lagre", exact: true })).toBeDisabled();
  const modal = page.locator('div[role="dialog"]');
  await modal.locator("div[name='title']").fill("test");
  await modal.locator("div[name='subtitle']").fill("test");
  await page.getByTestId("select-image-from-list").first().click();
  await page.getByTestId("use-image").click();
  await expect(page.getByRole("button", { name: "Lagre", exact: true })).toBeEnabled();
  await page.getByRole("button", { name: "Lagre", exact: true }).click();
  await expect(page.getByTestId("slate-key-figure")).toBeVisible();
  await page.getByTestId("remove-key-figure").click();
  expect(await page.getByTestId("slate-key-figure").count()).toEqual(0);
});

test("adds and removes blogpost", async ({ page }) => {
  await page.getByTestId("create-blogPost").click();
  await expect(page.getByRole("button", { name: "Lagre", exact: true })).toBeDisabled();
  const modal = page.locator('div[role="dialog"]');
  await modal.locator("div[name='title']").fill("test");
  await page.locator("input[name='author']").fill("test");
  await page.locator("input[name='link']").fill("https://test.test");
  await page.getByTestId("select-image-from-list").first().click();
  await page.getByTestId("use-image").click();
  await expect(page.getByRole("button", { name: "Lagre", exact: true })).toBeEnabled();
  await page.getByRole("button", { name: "Lagre", exact: true }).click();
  await expect(page.getByTestId("slate-blog-post")).toBeVisible();
  await page.getByTestId("remove-blogpost").click();
  expect(await page.getByTestId("slate-blog-post").count()).toEqual(0);
});

test("adds and removes contactblock", async ({ page }) => {
  await page.getByTestId("create-contactBlock").click();
  await expect(page.getByRole("button", { name: "Lagre", exact: true })).toBeDisabled();
  await page.locator("input[name='name']").fill("test");
  await page.locator("input[name='jobTitle']").fill("test");
  await page.locator("input[name='email']").fill("email@email.no");
  await page.locator("textarea[name='description']").fill("email");
  await page.getByTestId("select-image-from-list").first().click();
  await page.getByTestId("use-image").click();
  await expect(page.getByRole("button", { name: "Lagre", exact: true })).toBeEnabled();
  await page.getByRole("button", { name: "Lagre", exact: true }).click();
  await expect(page.getByTestId("slate-contact-block")).toBeVisible();
  await page.getByTestId("remove-contact-block").click();
  expect(await page.getByTestId("slate-contact-block").count()).toEqual(0);
});

test("adds and removes campaignblock", async ({ page }) => {
  await page.getByTestId("create-campaignBlock").click();
  await expect(page.getByRole("button", { name: "Lagre", exact: true })).toBeDisabled();
  const modal = page.locator('div[role="dialog"]');
  await modal.locator("div[name='title']").fill("test");
  await modal.locator("div[name='description']").fill("test");
  await page.locator("input[name='link']").fill("https://test.test");
  await modal.locator("div[name='linkText']").fill("Test page");
  await page.getByTestId("select-image-from-list").first().click();
  await page.getByTestId("use-image").click();
  await expect(page.getByRole("button", { name: "Lagre", exact: true })).toBeEnabled();
  await page.getByRole("button", { name: "Lagre", exact: true }).click();
  await expect(page.getByTestId("slate-campaign-block")).toBeVisible();
  await page.getByTestId("remove-campaign-block").click();
  expect(await page.getByTestId("slate-campaign-block").count()).toEqual(0);
});
