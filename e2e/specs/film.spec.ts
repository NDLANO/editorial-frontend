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
  await page.goto("/film/nb");
  await page.getByRole("heading", { name: "Film" }).first().waitFor();
});

test("Can add a movie to the slideshow", async ({ page }) => {
  const movie = "Brukerstøtte";
  await page.getByTestId("dropdown-input").first().fill(movie);
  await page.getByTestId("dropdown-item").first().click();
  await expect(page.getByTestId("elementListItem").filter({ hasText: movie }).first()).toBeVisible();
});

test("Can remove movie from list", async ({ page }) => {
  const movie = page.getByLabel("Slideshow").getByTestId("elementListItem").filter({ hasText: "Chef Flynn" });
  await expect(movie).toBeVisible();
  await movie.getByTestId("elementListItemDeleteButton").click();
  await expect(movie).not.toBeVisible();
});

test("Can add and remove theme", async ({ page }) => {
  await page.getByTestId("add-theme-modal").click();
  await page.getByLabel("Bokmål").fill("Ny testgruppe");
  await page.getByRole("button", { name: "Opprett gruppe" }).click();
  await expect(page.getByRole("heading", { name: "Ny testgruppe" })).toBeVisible();
});

test("Can save changes with new data", async ({ page, harCheckpoint }) => {
  await page.getByTestId("add-theme-modal").click();
  await page.getByLabel("Bokmål").fill("Testgruppee");
  await page.getByRole("button", { name: "Opprett gruppe" }).click();
  await page.getByPlaceholder('Legg til film i "Testgruppee"').fill("Brukerstøtte");
  await page.getByTestId("dropdown-item").getByText("Brukerstøtte").first().click();
  await page.click("body");

  await harCheckpoint();
  await page.getByRole("button").getByText("Lagre").click();
  await page.getByRole("button").getByText("Lagret").waitFor();
  await expect(page.getByTestId("elementListItem").filter({ hasText: "Brukerstøtte" })).toBeVisible();
  await page.getByTestId("deleteThemeButton").last().click();

  await harCheckpoint();
  await page.getByRole("button").getByText("Lagre").click();
  await page.getByRole("button").getByText("Lagret").waitFor();
  await expect(page.getByTestId("elementListItem").filter({ hasText: "Brukerstøtte" })).toBeVisible({
    visible: false,
  });
});
