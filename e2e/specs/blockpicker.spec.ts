/**
 * Copyright (c) 2023-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { test, expect } from '@playwright/test';
import { mockRoute } from '../apiMock';
import { brightcoveTokenMock, responsiblesMock, zendeskMock } from '../mockResponses';
test.beforeEach(async ({ page }) => {
  const zendesk = mockRoute({
    page,
    path: '**/get_zendesk_token',
    fixture: 'blockpicker_zendesk_token',
    overrideValue: JSON.stringify(zendeskMock),
  });

  const responsibles = mockRoute({
    page,
    path: '**/get_responsibles?permission=drafts:responsible',
    fixture: 'blockpicker_responsibles',
    overrideValue: JSON.stringify(responsiblesMock),
  });

  const licenses = mockRoute({
    page,
    path: '**/draft-api/v1/drafts/licenses/',
    fixture: 'blockpicker_licenses',
  });

  const statuses = mockRoute({
    page,
    path: '**/draft-api/v1/drafts/status-state-machine/',
    fixture: 'blockpicker_status_state_machine',
  });

  await page.goto('/subject-matter/learning-resource/new');

  await Promise.all([zendesk, responsibles, licenses, statuses]);
  const el = page.locator('[data-cy="slate-editor"]');
  await el.click();
  await page.locator('[data-cy="slate-block-picker"]').click();
  await expect(page.locator('[data-cy="slate-block-picker-menu"]')).toBeVisible();
});

test('adds and removes factAside', async ({ page }) => {
  await page.locator('[data-cy="create-factAside"]').click();
  await expect(page.locator('[data-cy="remove-fact-aside"]')).toBeVisible();
  await page.locator('[data-cy="remove-fact-aside"]').click();
  await expect(page.locator('[data-cy="remove-fact-aside"]')).toHaveCount(0);
});

test('adds and removes table', async ({ page }) => {
  await page.locator('[data-cy="create-table"]').click();
  await expect(page.locator('[data-cy="table-remove"]')).toBeVisible();
  await page.locator('[data-cy="table-remove"]').click();
  await expect(page.locator('[data-cy="table-remove"]')).toHaveCount(0);
});

test('adds and removes bodybox', async ({ page }) => {
  await page.locator('[data-cy="create-bodybox"]').click();
  await expect(page.locator('[data-cy="remove-bodybox"]')).toBeVisible();
  await page.locator('[data-cy="remove-bodybox"]').click();
  await expect(page.locator('[data-cy="remove-bodybox"]')).toHaveCount(0);
});

test('adds and removes details', async ({ page }) => {
  await page.locator('[data-cy="create-details"]').click();
  await expect(page.locator('[data-cy="remove-details"]')).toBeVisible();
  await page.locator('[data-cy="remove-details"]').click();
  await expect(page.locator('[data-cy="remove-details"]')).toHaveCount(0);
});

test('adds and removes grid', async ({ page }) => {
  await page.locator('[data-cy="create-grid"]').click();
  await expect(page.locator('[data-cy="remove-grid"]')).toBeVisible();
  await page.locator('[data-cy="remove-grid"]').click();
  await expect(page.locator('[data-cy="remove-grid"]')).toHaveCount(0);
});

test('adds and removes code-block', async ({ page }) => {
  await page.locator('[data-cy="create-code"]').click();
  await expect(page.locator('[data-cy="modal-header"]')).toBeVisible();
  const modalBody = page.locator('[data-cy="modal-body"]');
  await modalBody.locator('input').first().fill('Tittel');
  await modalBody.locator('select').selectOption('HTML');
  await modalBody.locator('textarea').first().fill('Some <strong>markup</strong>{enter}Newline');
  await page.getByRole('button').getByText('Lagre').click();
  await expect(page.locator('[data-cy="remove-code"]')).toBeVisible();
  await page.locator('[data-cy="remove-code"]').click();
  await expect(page.locator('[data-cy="remove-code"]')).toHaveCount(0);
});

test('adds and removes image', async ({ page }) => {
  const images = mockRoute({
    page,
    path: '**/image-api/v3/images/?fallback=true&language=nb&page=1&page-size=16',
    fixture: 'blockpicker_images',
  });
  const image = mockRoute({
    page,
    path: '**/image-api/v3/images/63415?language=nb',
    fixture: 'blockpicker_image',
  });
  await page.locator('[data-cy="create-image"]').click();
  await images;
  await page.locator('[data-cy="select-image-from-list"]').first().click();
  await image;
  await page.locator('[data-cy="use-image"]').click();
  await expect(page.locator('[data-cy="remove-element"]')).toBeVisible();
  await page.locator('[data-cy="remove-element"]').click();
  await expect(page.locator('[data-cy="remove-element"]')).toHaveCount(0);
});

test('opens and closes video', async ({ page }) => {
  const brightcoveToken = mockRoute({
    page,
    path: '**/get_brightcove_token',
    fixture: 'brightcove_token',
    overrideValue: JSON.stringify(brightcoveTokenMock),
  });
  const brightcoveVideos = mockRoute({
    page,
    path: '**/v1/accounts/*/videos/?limit=10&offset=0&q=',
    fixture: 'brightcove_videos',
  });
  const brightcoveVideo = mockRoute({
    page,
    path: '**/v1/accounts/*/videos/6317543916112',
    fixture: 'brightcove_video',
  });
  const brightcovePlayback = mockRoute({
    page,
    path: '**/playback/v1/accounts/*/videos/6317543916112',
    fixture: 'brightcove_playback',
  });
  await page.locator('[data-cy="create-video"]').click();
  await Promise.all([brightcoveToken, brightcoveVideos]);
  await page.locator('[data-cy="use-video"]').first().click();
  await Promise.all([brightcoveVideo, brightcovePlayback]);
  await expect(page.locator('[data-cy="remove-element"]')).toBeVisible();
  await page.locator('[data-cy="remove-element"]').click();
  await expect(page.locator('[data-cy="remove-element"]')).toHaveCount(0);
});

test('opens and closes audio', async ({ page }) => {
  const audios = mockRoute({
    page,
    path: '**/audio-api/v1/audio/?audio-type=standard&language=nb&page=1&page-size=16&query=',
    fixture: 'blockpicker_audios',
  });

  const reusedAudio = mockRoute({
    page,
    path: '**/audio-api/v1/audio/*?language=nb',
    fixture: 'blockpicker_any_audio',
  });
  await page.locator('[data-cy="create-audio"]').click();
  await Promise.all([audios, reusedAudio]);
  await expect(page.locator('[data-cy="modal-header"]')).toBeVisible();
  await page.getByRole('button').getByText('Velg lyd').first().click();
  await expect(page.locator('[data-cy="modal-header"]')).toHaveCount(0);
  await expect(page.locator('[data-cy="remove-element"]')).toBeVisible();
  await page.locator('[data-cy="remove-element"]').click();
  await expect(page.locator('[data-cy="remove-element"]')).toHaveCount(0);
});

test('opens and closes file', async ({ page }) => {
  await page.locator('[data-cy="create-file"]').click();
  await expect(page.locator('[data-cy="modal-header"]')).toBeVisible();
  await page.locator("[data-cy='close-modal-button']").click();
  await expect(page.locator('[data-cy="modal-header"]')).toHaveCount(0);
});

test('opens and closes url', async ({ page }) => {
  await page.locator('[data-cy="create-url"]').click();
  await expect(page.locator('[data-cy="modal-header"]')).toBeVisible();
  await page.locator("[data-cy='close-modal-button']").click();
  await expect(page.locator('[data-cy="modal-header"]')).toHaveCount(0);
});

test('opens and closes related content', async ({ page }) => {
  const relatedContent = mockRoute({
    page,
    path: '**/search-api/v1/search/editorial/*',
    fixture: 'blockpicker_related_content',
  });
  await page.locator('[data-cy="create-related"]').click();
  await relatedContent;
  await expect(page.getByTestId('editRelated')).toBeVisible();
  await page.locator("[data-cy='close-related-button']").click();
  await expect(page.locator('[data-cy="styled-article-modal"]')).toHaveCount(0);
});
