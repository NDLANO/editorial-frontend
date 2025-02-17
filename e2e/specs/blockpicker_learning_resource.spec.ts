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
  await page.goto("/subject-matter/learning-resource/new");
  await page.getByTestId("slate-editor").click();
  await page.getByTestId("slate-block-picker").click();
  await expect(page.getByTestId("slate-block-picker-menu")).toBeVisible();
});

test("adds and removes factAside", async ({ page }) => {
  await page.getByTestId("create-factAside").click();
  await expect(page.getByTestId("remove-fact-aside")).toBeVisible();
  await page.getByTestId("remove-fact-aside").click();
  await expect(page.getByTestId("remove-fact-aside")).toHaveCount(0);
});

test("adds and removes table", async ({ page }) => {
  await page.getByTestId("create-table").click();
  await expect(page.getByTestId("table-remove")).toBeVisible();
  await page.getByTestId("table-remove").click();
  await expect(page.getByTestId("table-remove")).toHaveCount(0);
});

test("adds and removes framedcontent", async ({ page }) => {
  await page.getByTestId("create-framedContent").click();
  await expect(page.getByTestId("remove-framedContent")).toBeVisible();
  await page.getByTestId("remove-framedContent").click();
  await expect(page.getByTestId("remove-framedContent")).toHaveCount(0);
});

test("adds and removes details", async ({ page }) => {
  await page.getByTestId("create-details").click();
  await expect(page.getByTestId("remove-details")).toBeVisible();
  await page.getByTestId("remove-details").click();
  await expect(page.getByTestId("remove-details")).toHaveCount(0);
});

test("adds and removes grid", async ({ page }) => {
  await page.mouse.wheel(0, 50);
  await page.getByTestId("create-grid").click();
  await expect(page.getByTestId("remove-grid")).toBeVisible();
  await page.getByTestId("slate-grid-cell").first().click();
  await page.getByTestId("slate-block-picker").click();
  await expect(page.getByTestId("slate-block-picker-menu").getByRole("button")).toHaveCount(2);
  await page.getByTestId("remove-grid").click();
  await expect(page.getByTestId("remove-grid")).toHaveCount(0);
});

test("adds and removes code-block", async ({ page }) => {
  await page.getByTestId("create-code").click();
  const dialog = page.getByRole("dialog").filter({ hasText: "Legg til kodeeksempel" });
  await expect(dialog).toBeVisible();
  await dialog.getByLabel("Tittel").fill("Tittel");
  await dialog.getByRole("combobox", { name: "Velg kodespråk:" }).click();
  await dialog.getByRole("option", { name: "Markdown" }).click();
  await dialog.locator("textarea").first().fill("Some <strong>markup</strong>{enter}Newline");
  await dialog.getByRole("button", { name: "Lagre" }).click();
  await expect(page.getByTestId("remove-code")).toBeVisible();
  await page.getByTestId("remove-code").click();
  await expect(page.getByTestId("remove-code")).toHaveCount(0);
});

test("adds and removes image", async ({ page }) => {
  await page.getByTestId("create-image").click();
  await page.getByTestId("select-image-from-list").first().click();
  await page.getByTestId("use-image").click();
  await expect(page.getByTestId("remove-element")).toBeVisible();
  await page.getByTestId("remove-element").click();
  await expect(page.getByTestId("remove-element")).toHaveCount(0);
});

test("adds and removes disclaimer", async ({ page }) => {
  await page.getByTestId("create-disclaimer").click();
  await page.getByTestId("disclaimer-editor").click();
  await page.keyboard.type("Test disclaimer");
  await page.getByTestId("disclaimer-save").click();
  await expect(page.getByTestId("delete-disclaimer")).toBeVisible();
  await page.getByTestId("delete-disclaimer").click();
  await expect(page.getByTestId("delete-disclaimer")).toHaveCount(0);
});

test("opens and closes video", async ({ page }) => {
  await page.getByTestId("create-video").click();
  await page.getByText("Bruk video").first().click();
  await expect(page.getByTestId("remove-video-element")).toBeVisible();
  await page.getByTestId("remove-video-element").click();
  await expect(page.getByTestId("remove-video-element")).toHaveCount(0);
});

test("opens and closes audio", async ({ page }) => {
  await page.getByTestId("create-audio").click();
  await page.getByRole("button").getByText("Velg lyd").first().click();
  await expect(page.getByTestId("remove-element")).toBeVisible();
  await page.getByTestId("remove-element").click();
  await expect(page.getByTestId("remove-element")).toHaveCount(0);
});

test("opens and closes file", async ({ page }) => {
  await page.getByTestId("create-file").click();
  await expect(
    page.getByRole("dialog").filter({ hasText: "Dra og slipp eller trykk for å laste opp fil(er)" }),
  ).toBeVisible();
  await page.getByRole("dialog").getByRole("button", { name: "Avbryt" }).click();
  await expect(page.getByRole("dialog")).toHaveCount(0);
});

test("opens and closes url", async ({ page }) => {
  await page.getByTestId("create-url").click();
  const dialog = page.getByRole("dialog").filter({ hasText: "Ny ressurs" });
  await dialog.getByRole("button").getByText("Avbryt").click();
  await expect(page.getByRole("dialog")).toHaveCount(0);
});

test("opens and closes related content", async ({ page }) => {
  await page.getByTestId("create-related").click();
  await expect(page.getByTestId("editRelated")).toBeVisible();
  await page.getByRole("button", { name: "Lukk" }).click();
  await expect(page.getByRole("dialog")).toHaveCount(0);
});
