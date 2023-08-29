/**
 * Copyright (c) 2023-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { test, expect } from '@playwright/test';
import { mockRoute } from '../apiMock';
import { responsiblesMock, zendeskMock } from '../mockResponses';

test.beforeEach(async ({ page }) => {
  const zendesk = await mockRoute({
    page,
    path: '**/get_zendesk_token',
    fixture: 'table_zendesk_token',
    overrideValue: JSON.stringify(zendeskMock),
  });

  const responsibles = await mockRoute({
    page,
    path: '**/get_responsibles?permission=drafts:responsible',
    fixture: 'table_responsibles',
    overrideValue: JSON.stringify(responsiblesMock),
  });

  const licenses = await mockRoute({
    page,
    path: '**/draft-api/v1/drafts/licenses/',
    fixture: 'table_licenses',
  });

  const statuses = await mockRoute({
    page,
    path: '**/draft-api/v1/drafts/status-state-machine/',
    fixture: 'table_status_state_machine',
  });

  await page.goto('/subject-matter/learning-resource/new');

  await Promise.all([zendesk, responsibles, licenses, statuses]);
});

test('all table functions work', async ({ page }) => {
  const el = page.locator('[data-cy="slate-editor"]');
  await el.click();
  await page.locator('[data-cy="slate-block-picker"]').click();
  await expect(page.locator('[data-cy="slate-block-picker-menu"]')).toBeVisible();
  await page.locator('[data-cy="create-table"]').click();
  const caption = page.locator('caption');
  await caption.click();
  await page.keyboard.type('TITTEL!');
  await expect(page.locator('caption')).toHaveText('TITTEL!');
  await page.locator('tbody > tr > td').first().fill('Cell');
  const header = page.locator('thead > tr > th').first();
  await header.click();
  await page.keyboard.type('Header 1');
  await page.keyboard.press('ArrowRight');
  await page.keyboard.type('Header 2');
  await page.locator('[data-cy="column-add"]').click();
  await page.locator('thead > tr > th').last().click();
  await page.keyboard.type('Test new column');
  await page.locator('[data-cy="row-remove"]').click();
  await page.locator('[data-cy="head-add"]').click();
  await page.locator('thead > tr > th').last().click();
  await page.keyboard.type('Test new header');
  await page.keyboard.press('ArrowDown');
  await page.locator('[data-cy="row-add"]').click();
  await page.locator('tbody > tr > td').last().click();
  await page.keyboard.type('Test new row');
  await page.locator('[data-cy="toggle-row-headers"]').click();
  await page.locator('[data-cy="column-remove"]').click();
  await page.locator('[data-cy="row-remove"]').click();
  await page.locator('[data-cy="table-remove"]').click();
});
