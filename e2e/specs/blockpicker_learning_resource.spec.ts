/**
 * Copyright (c) 2023-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { test, expect } from "@playwright/test";
import { mockRoute } from "../apiMock";
import { brightcoveTokenMock, copyrightMock, responsiblesMock, zendeskMock } from "../mockResponses";
test.beforeEach(async ({ page }) => {
  const zendesk = mockRoute({
    page,
    path: "**/get_zendesk_token",
    fixture: "blockpicker_zendesk_token",
    overrideValue: JSON.stringify(zendeskMock),
  });

  const responsibles = mockRoute({
    page,
    path: "**/get_responsibles?permission=drafts:responsible",
    fixture: "blockpicker_responsibles",
    overrideValue: JSON.stringify(responsiblesMock),
  });

  const licenses = mockRoute({
    page,
    path: "**/draft-api/v1/drafts/licenses/",
    fixture: "blockpicker_licenses",
  });

  const statuses = mockRoute({
    page,
    path: "**/draft-api/v1/drafts/status-state-machine/",
    fixture: "blockpicker_status_state_machine",
  });

  await page.goto("/subject-matter/learning-resource/new");

  await Promise.all([zendesk, responsibles, licenses, statuses]);
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
  expect(await page.getByTestId("slate-block-picker-menu").getByRole("button").count()).toEqual(2);
  await page.getByTestId("remove-grid").click();
  await expect(page.getByTestId("remove-grid")).toHaveCount(0);
});

test("adds and removes code-block", async ({ page }) => {
  await page.getByTestId("create-code").click();
  await expect(page.getByTestId("modal-header")).toBeVisible();
  const modalBody = page.getByTestId("modal-body");
  await modalBody.locator("input").first().fill("Tittel");
  await modalBody.locator("select").selectOption("HTML");
  await modalBody.locator("textarea").first().fill("Some <strong>markup</strong>{enter}Newline");
  await page.getByRole("button").getByText("Lagre").click();
  await expect(page.getByTestId("remove-code")).toBeVisible();
  await page.getByTestId("remove-code").click();
  await expect(page.getByTestId("remove-code")).toHaveCount(0);
});

test("adds and removes image", async ({ page }) => {
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
  await Promise.all([images, image]);
  await page.getByTestId("create-image").click();
  await page.getByTestId("select-image-from-list").first().click();
  await page.getByTestId("use-image").click();
  await expect(page.getByTestId("remove-element")).toBeVisible();
  await page.getByTestId("remove-element").click();
  await expect(page.getByTestId("remove-element")).toHaveCount(0);
});

test("adds and removes disclaimer", async ({ page }) => {
  await page.getByTestId("create-disclaimer").click();
  await expect(page.getByTestId("delete-disclaimer")).toBeVisible();
  await page.getByTestId("delete-disclaimer").click();
  await expect(page.getByTestId("delete-disclaimer")).toHaveCount(0);
});

test("opens and closes video", async ({ page }) => {
  const brightcoveToken = mockRoute({
    page,
    path: "**/get_brightcove_token",
    fixture: "brightcove_token",
    overrideValue: JSON.stringify(brightcoveTokenMock),
  });
  const brightcoveVideos = mockRoute({
    page,
    path: "**/v1/accounts/*/videos/?limit=10&offset=0&q=",
    fixture: "brightcove_videos",
  });
  const brightcoveVideo = mockRoute({
    page,
    path: "**/v1/accounts/*/videos/6320387876112",
    fixture: "brightcove_video",
  });
  const brightcovePlayback = mockRoute({
    page,
    path: "**/playback/v1/accounts/*/videos/6317543916112",
    fixture: "brightcove_playback",
  });
  await Promise.all([brightcoveToken, brightcoveVideos, brightcoveVideo, brightcovePlayback]);
  await page.getByTestId("create-video").click();
  await page.getByText("Bruk video").first().click();
  await expect(page.getByTestId("remove-element")).toBeVisible();
  await page.getByTestId("remove-element").click();
  await expect(page.getByTestId("remove-element")).toHaveCount(0);
});

test("opens and closes audio", async ({ page }) => {
  const audios = mockRoute({
    page,
    path: "**/audio-api/v1/audio/?audio-type=standard&language=nb&page=1&page-size=16&query=",
    fixture: "blockpicker_audios",
  });

  const reusedAudio = mockRoute({
    page,
    path: "**/audio-api/v1/audio/*?language=nb",
    fixture: "blockpicker_any_audio",
  });
  await Promise.all([audios, reusedAudio]);
  await page.getByTestId("create-audio").click();
  await expect(page.getByTestId("modal-header")).toBeVisible();
  await page.getByRole("button").getByText("Velg lyd").first().click();
  await expect(page.getByTestId("modal-header")).toHaveCount(0);
  await expect(page.getByTestId("remove-element")).toBeVisible();
  await page.getByTestId("remove-element").click();
  await expect(page.getByTestId("remove-element")).toHaveCount(0);
});

test("opens and closes file", async ({ page }) => {
  await page.getByTestId("create-file").click();
  await expect(page.getByTestId("modal-header")).toBeVisible();
  await page.getByTestId("close-modal-button").click();
  await expect(page.getByTestId("modal-header")).toHaveCount(0);
});

test("opens and closes url", async ({ page }) => {
  await page.getByTestId("create-url").click();
  await expect(page.getByTestId("modal-header")).toBeVisible();
  await page.getByTestId("close-modal-button").click();
  await expect(page.getByTestId("modal-header")).toHaveCount(0);
});

test("opens and closes related content", async ({ page }) => {
  await mockRoute({
    page,
    path: "**/search-api/v1/search/editorial/*",
    fixture: "blockpicker_related_content",
  });
  await page.getByTestId("create-related").click();
  await expect(page.getByTestId("editRelated")).toBeVisible();
  await page.getByTestId("close-related-button").click();
  await expect(page.getByTestId("styled-article-modal")).toHaveCount(0);
});
