/**
 * Copyright (c) 2023-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { test, expect } from '@playwright/test';
import { mockRoute } from '../apiMock';
import { copyrightMock, responsiblesMock, zendeskMock } from '../mockResponses';

test.beforeEach(async ({ page }) => {
  const zendesk = mockRoute({
    page,
    path: '**/get_zendesk_token',
    fixture: 'blockpicker_frontpage_zendesk_token',
    overrideValue: JSON.stringify(zendeskMock),
  });

  const responsibles = mockRoute({
    page,
    path: '**/get_responsibles?permission=drafts:responsible',
    fixture: 'blockpicker_frontpage_responsibles',
    overrideValue: JSON.stringify(responsiblesMock),
  });

  const licenses = mockRoute({
    page,
    path: '**/draft-api/v1/drafts/licenses/',
    fixture: 'blockpicker_frontpage_licenses',
  });

  const statuses = mockRoute({
    page,
    path: '**/draft-api/v1/drafts/status-state-machine/',
    fixture: 'blockpicker_frontpage_status_state_machine',
  });

  const images = mockRoute({
    page,
    path: '**/image-api/v3/images/?page=1&page-size=16',
    fixture: 'blockpicker_frontpage_images',
    overrideValue: (val) =>
      JSON.stringify({
        ...JSON.parse(val),
        results: JSON.parse(val).results.map((image) => ({ ...image, copyright: copyrightMock })),
      }),
  });

  const image = mockRoute({
    page,
    path: '**/image-api/v3/images/63415?language=*',
    fixture: 'blockpicker_frontpage_image',
    overrideValue: (val) => JSON.stringify({ ...JSON.parse(val), copyright: copyrightMock }),
  });

  await page.goto('/subject-matter/frontpage-article/new');

  await Promise.all([zendesk, responsibles, licenses, statuses, images, image]);
  const el = page.locator('[data-cy="slate-editor"]');
  await el.click();
  await page.locator('[data-cy="slate-block-picker"]').click();
  await expect(page.locator('[data-cy="slate-block-picker-menu"]')).toBeVisible();
});

test('adds and removes grid', async ({ page }) => {
  await page.locator("[data-cy='create-grid']").click();
  expect(await page.getByTestId('grid-cell').count()).toEqual(2);
  await page.getByTestId('grid-cell').first().click();
  await page.locator('[data-cy="slate-block-picker"]').click();
  await expect(page.locator("[data-cy='create-keyFigure']")).toBeVisible();
  await expect(page.locator("[data-cy='create-image']")).toBeVisible();
  await expect(page.locator("[data-cy='create-blogPost']")).toBeVisible();
  expect(
    await page.locator("[data-cy='slate-block-picker-menu']").getByRole('button').count(),
  ).toEqual(6);
  await expect(page.locator('[data-cy="remove-grid"]')).toBeVisible();
  await page.locator('[data-cy="remove-grid"]').click();
  await expect(page.locator('[data-cy="remove-grid"]')).toHaveCount(0);
});

test('adds and removes keyfigure', async ({ page }) => {
  await page.locator("[data-cy='create-keyFigure']").click();
  const lagreButton = page.getByRole('button', { name: 'Lagre', exact: true });
  expect(lagreButton).toBeDisabled();
  await page.locator("input[name='title']").fill('test');
  await page.locator("input[name='subtitle']").fill('test');
  await page.locator('[data-cy="select-image-from-list"]').first().click();
  await page.locator('[data-cy="use-image"]').click();
  expect(lagreButton).toBeEnabled();
  await lagreButton.click();
  expect(page.getByTestId('slate-key-figure')).toBeVisible();
  await page.getByTestId('remove-key-figure').click();
  expect(await page.getByTestId('slate-key-figure').count()).toEqual(0);
});

test('adds and removes blogpost', async ({ page }) => {
  await page.locator("[data-cy='create-blogPost']").click();
  const lagreButton = page.getByRole('button', { name: 'Lagre', exact: true });
  expect(lagreButton).toBeDisabled();
  await page.locator("input[name='title']").fill('test');
  await page.locator("input[name='author']").fill('test');
  await page.locator("input[name='link']").fill('https://test.test');
  await page.locator('[data-cy="select-image-from-list"]').first().click();
  await page.locator('[data-cy="use-image"]').click();
  expect(lagreButton).toBeEnabled();
  await lagreButton.click();
  expect(page.getByTestId('slate-blog-post')).toBeVisible();
  await page.getByTestId('remove-blogpost').click();
  expect(await page.getByTestId('slate-blog-post').count()).toEqual(0);
});

test('adds and removes contactblock', async ({ page }) => {
  await page.locator("[data-cy='create-contactBlock']").click();
  const lagreButton = page.getByRole('button', { name: 'Lagre', exact: true });
  expect(lagreButton).toBeDisabled();
  await page.locator("input[name='name']").fill('test');
  await page.locator("input[name='jobTitle']").fill('test');
  await page.locator("input[name='email']").fill('email');
  await page.locator("textarea[name='description']").fill('email');
  await page.locator('[data-cy="select-image-from-list"]').first().click();
  await page.locator('[data-cy="use-image"]').click();
  expect(lagreButton).toBeEnabled();
  await lagreButton.click();
  expect(page.getByTestId('slate-contact-block')).toBeVisible();
  await page.getByTestId('remove-contact-block').click();
  expect(await page.getByTestId('slate-contact-block').count()).toEqual(0);
});

test('adds and removes campaignblock', async ({ page }) => {
  await page.locator("[data-cy='create-campaignBlock']").click();
  const lagreButton = page.getByRole('button', { name: 'Lagre', exact: true });
  expect(lagreButton).toBeDisabled();
  await page.locator("input[name='title']").fill('test');
  await page.locator("textarea[name='description']").fill('test');
  await page.locator("input[name='link']").fill('https://test.test');
  await page.locator("input[name='linkText']").fill('Test page');
  await page.getByRole('button', { name: 'Sett inn bilde til venstre', exact: true }).click();
  await page.locator('[data-cy="select-image-from-list"]').first().click();
  await page.locator('[data-cy="use-image"]').click();
  await page.getByRole('button', { name: 'Sett inn bilde til høyre', exact: true }).click();
  await page.locator('[data-cy="select-image-from-list"]').first().click();
  await page.locator('[data-cy="use-image"]').click();
  expect(lagreButton).toBeEnabled();
  await lagreButton.click();
  expect(page.getByTestId('slate-campaign-block')).toBeVisible();
  await page.getByTestId('remove-campaign-block').click();
  expect(await page.getByTestId('slate-campaign-block').count()).toEqual(0);
});
