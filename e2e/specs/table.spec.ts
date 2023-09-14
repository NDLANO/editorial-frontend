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

  await Promise.all([zendesk, responsibles, licenses, statuses]);

  await page.goto('/subject-matter/learning-resource/new');
  await page.locator('[data-cy="slate-editor"]').click();
  await page.locator('[data-cy="slate-block-picker"]').click();
  await page.locator('[data-cy="create-table"]').click();
});

test('all table functions work', async ({ page }) => {
  expect(await page.locator('th').count()).toEqual(2);
  expect(await page.locator('td').count()).toEqual(2);
  expect(await page.locator('tr').count()).toEqual(2);
  await page.locator('caption').click();
  await page.keyboard.type('TITTEL!');
  await expect(page.locator('caption')).toHaveText('TITTEL!');
  await page.locator('tbody > tr > td').first().fill('Cell');
  await page.locator('thead > tr > th').first().click();
  await page.keyboard.type('Header 1');
  await page.keyboard.press('ArrowRight');
  await page.keyboard.type('Header 2');
  await expect(page.locator('thead > tr > th').first()).toHaveText('Header 1');
  await expect(page.locator('thead > tr > th').last()).toHaveText('Header 2');
  await page.locator('[data-cy="column-add"]').click();
  expect(await page.locator('th').count()).toEqual(3);
  expect(await page.locator('td').count()).toEqual(3);

  await page.locator('thead > tr > th').last().click();
  await page.keyboard.type('Test new column');

  await page.locator('[data-cy="row-remove"]').click();
  expect(await page.locator('th').count()).toEqual(0);
  expect(await page.locator('td').count()).toEqual(3);
  expect(await page.locator('tr').count()).toEqual(1);
  await page.locator('[data-cy="head-add"]').click();
  expect(await page.locator('tr').count()).toEqual(2);
  expect(await page.locator('th').count()).toEqual(3);
  expect(await page.locator('td').count()).toEqual(3);

  await page.locator('thead > tr > th').last().click();
  await page.keyboard.type('Test new header');
  await page.keyboard.press('ArrowDown');
  await page.locator('[data-cy="row-add"]').click();
  await page.locator('tbody > tr > td').last().click();
  expect(await page.locator('tr').count()).toEqual(3);
  expect(await page.locator('td').count()).toEqual(6);
  await page.keyboard.type('Test new row');
  await page.locator('[data-cy="toggle-row-headers"]').click();
  expect(await page.locator('th').count()).toEqual(5);
  expect(await page.locator('td').count()).toEqual(4);
  await page.locator('[data-cy="column-remove"]').click();
  expect(await page.locator('th').count()).toEqual(4);
  expect(await page.locator('td').count()).toEqual(2);
  await page.locator('[data-cy="row-remove"]').click();
  expect(await page.locator('tr').count()).toEqual(2);
  await page.locator('[data-cy="table-remove"]').click();
});

test('blockpicker to give limited options in table', async ({ page }) => {
  await page.locator('thead > tr > th').first().click();
  expect(page.locator('[data-cy="slate-block-picker"]')).toBeVisible({ visible: false });

  await page.locator('thead > tr > td').first().click();
  expect(page.locator('[data-cy="slate-block-picker"]')).toBeVisible();
  await page.locator('[data-cy="slate-block-picker"]').click();
  expect(page.locator('[data-cy="create-image"]')).toBeVisible();
  expect(page.locator('[data-cy="slate-block-picker-menu"]').getByRole('button').count()).toEqual(
    2,
  );
});
