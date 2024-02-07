/**
 * Copyright (c) 2024-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { test, expect } from "@playwright/test";
import { mockRoute } from "../apiMock";
import { copyrightMock, responsiblesMock, zendeskMock } from "../mockResponses";

test.beforeEach(async ({ page }) => {
  const zendesk = await mockRoute({
    page,
    path: "**/get_zendesk_token",
    fixture: "grid_zendesk_token",
    overrideValue: JSON.stringify(zendeskMock),
  });

  const responsibles = await mockRoute({
    page,
    path: "**/get_responsibles?permission=drafts:responsible",
    fixture: "grid_responsibles",
    overrideValue: JSON.stringify(responsiblesMock),
  });

  const licenses = await mockRoute({
    page,
    path: "**/draft-api/v1/drafts/licenses/",
    fixture: "grid_licenses",
  });

  const statuses = await mockRoute({
    page,
    path: "**/draft-api/v1/drafts/status-state-machine/",
    fixture: "grid_status_state_machine",
  });
  const images = mockRoute({
    page,
    path: "**/image-api/v3/images/?fallback=true&language=nb&page=1&page-size=16",
    fixture: "blockpicker_images",
    overrideValue: (val) =>
      JSON.stringify({
        ...JSON.parse(val),
        results: JSON.parse(val).results.map((image) => ({ ...image, copyright: copyrightMock })),
      }),
  });
  const image = mockRoute({
    page,
    path: "**/image-api/v3/images/63415?language=nb",
    fixture: "blockpicker_image",
    overrideValue: (val) => JSON.stringify({ ...JSON.parse(val), copyright: copyrightMock }),
  });

  await Promise.all([zendesk, responsibles, licenses, statuses, images, image]);

  await page.goto("/subject-matter/learning-resource/new");
  await page.getByTestId("slate-editor").click();
  await page.mouse.wheel(0, 50);
  await page.getByTestId("slate-block-picker").click();
  await page.getByTestId("create-disclaimer").click();
});

test("update disclaimer text", async ({ page }) => {
  const newDisclaimerText = "This is a new disclaimer text";
  await page.getByTestId("edit-disclaimer").click();
  await page.getByTestId("disclaimer-editor").fill(newDisclaimerText);
  await page.getByTestId("disclaimer-save").click();
  await page.getByTestId("slate-disclaimer-block").click();
  await expect(page.getByText(newDisclaimerText, { exact: true })).toBeVisible();
});

test("add content to disclaimer", async ({ page }) => {
  await page.getByTestId("slate-disclaimer-content").click();
  await page.getByTestId("slate-block-picker").click();
  await page.getByTestId("create-image").click();
  await page.getByTestId("select-image-from-list").first().click();
  await page.getByTestId("use-image").click();
  await expect(page.getByTestId("remove-element")).toBeVisible();
});

test("keep content when deleting disclaimer", async ({ page }) => {
  await page.getByTestId("slate-disclaimer-content").click();
  await page.getByTestId("slate-block-picker").click();
  await page.getByTestId("create-image").click();
  await page.getByTestId("select-image-from-list").first().click();
  await page.getByTestId("use-image").click();
  await page.getByTestId("remove-disclaimer").click();
  await expect(page.getByTestId("remove-element")).toBeVisible();
});
