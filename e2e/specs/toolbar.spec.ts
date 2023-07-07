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

const metaKey = process.platform === 'darwin' ? 'Meta' : 'Control';

test.beforeEach(async ({ page }) => {
  const zendesk = await mockRoute({
    page,
    path: '**/get_zendesk_token',
    fixture: 'toolbar_zendesk_token',
    overrideValue: JSON.stringify(zendeskMock),
  });

  const responsibles = await mockRoute({
    page,
    path: '**/get_responsibles?permission=drafts:responsible',
    fixture: 'toolbar_responsibles',
    overrideValue: JSON.stringify(responsiblesMock),
  });

  const licenses = await mockRoute({
    page,
    path: '**/draft-api/v1/drafts/licenses/',
    fixture: 'toolbar_licenses',
  });

  const statuses = await mockRoute({
    page,
    path: '**/draft-api/v1/drafts/status-state-machine/',
    fixture: 'toolbar_status_state_machine',
  });

  await page.goto('/subject-matter/learning-resource/new');

  await Promise.all([zendesk, responsibles, licenses, statuses]);
});

test('can change text styling', async ({ page }) => {
  const el = page.locator('[data-cy="slate-editor"]');
  await el.click();
  await el.type('Text to style');
  await el.press(`${metaKey}+A`);
  const bold = page.getByTestId('toolbar-button-bold');
  await bold.click();
  expect(bold).toHaveAttribute('data-active', 'true');
  await bold.click();
  const italic = page.getByTestId('toolbar-button-italic');
  await italic.click();
  expect(italic).toHaveAttribute('data-active', 'true');
  await italic.click();
  const code = page.getByTestId('toolbar-button-code');
  await code.click();
  expect(code).toHaveAttribute('data-active', 'true');
  await code.click();
  const sub = page.getByTestId('toolbar-button-sub');
  await sub.click();
  expect(sub).toHaveAttribute('data-active', 'true');
  await sub.click();
  const sup = page.getByTestId('toolbar-button-sup');
  await sup.click();
  expect(sup).toHaveAttribute('data-active', 'true');
  await sup.click();
  const h2 = page.getByTestId('toolbar-button-heading-2');
  await h2.click();
  expect(h2).toHaveAttribute('data-active', 'true');
  await h2.click();
  await el.click();
  await el.press(`${metaKey}+A`);
  await el.type(' new heading ');
  await el.press(`${metaKey}+A`);
  const h3 = page.getByTestId('toolbar-button-heading-3');
  await h3.click();
  expect(h3).toHaveAttribute('data-active', 'true');
  await h3.click();
  await el.click();
  await el.press(`${metaKey}+A`);
  await el.type('This is test content');
  await el.press(`${metaKey}+A`);
  const quote = page.getByTestId('toolbar-button-quote');
  await quote.click();
  expect(quote).toHaveAttribute('data-active', 'true');
  await el.press('ArrowRight');
  await el.press('End');
  await el.press('Enter');
  await el.press('Enter');
  await el.type('test new line');
  await expect(page.getByRole('blockquote')).toHaveText('This is test content');
});

test('can create a valid link', async ({ page }) => {
  const el = page.locator('[data-cy="slate-editor"]');
  await el.click();
  await el.type('This is a test link');
  await el.press(`${metaKey}+A`);
  const link = page.getByTestId('toolbar-button-link');
  expect(link).toBeVisible();
  await link.click();
  await page.locator('input[name="href"]').fill('http://www.vg.no');
  await page.getByText('Sett inn lenke').click();
  await expect(page.getByText('Legg til lenke')).toHaveCount(0);
  await expect(page.locator('a[href="http://www.vg.no"][data-slate-node="element"]')).toBeVisible();
  await expect(page.locator('a[href="http://www.vg.no"][data-slate-node="element"]')).toHaveText(
    'This is a test link',
  );
});

test('All lists work properly', async ({ page }) => {
  const el = page.locator('[data-cy="slate-editor"]');
  await el.click();
  await el.type('First item in list');
  await el.press(`${metaKey}+A`);
  const numberedList = page.getByTestId('toolbar-button-numbered-list');
  await numberedList.click();
  await expect(numberedList).toHaveAttribute('data-active', 'true');
  await expect(page.getByRole('listitem')).toHaveCount(1);
  await el.press('ArrowRight');
  await el.press('End');
  await el.press('Enter');
  await el.type('Second item in list');
  await expect(page.getByRole('listitem')).toHaveCount(2);
  await el.press(`${metaKey}+A`);
  const bulletList = page.getByTestId('toolbar-button-bulleted-list');
  await bulletList.click();
  await expect(bulletList).toHaveAttribute('data-active', 'true');
  await expect(page.locator('ul > li')).toHaveCount(2);
  await el.press(`${metaKey}+A`);
  const letterList = page.getByTestId('toolbar-button-letter-list');
  await letterList.click();
  await expect(letterList).toHaveAttribute('data-active', 'true');
  await expect(page.locator('ol > li')).toHaveCount(2);
});

test('Definition list work properly', async ({ page }) => {
  const el = page.locator('[data-cy="slate-editor"]');
  await el.click();
  await el.type('Definition term');
  await el.press(`${metaKey}+A`);
  const definitionList = page.getByTestId('toolbar-button-definition-list');
  await definitionList.click();
  await expect(definitionList).toHaveAttribute('data-active', 'true');
  await expect(page.locator('dl > dt')).toHaveCount(1);
  await el.press('ArrowRight');
  await el.press('End');
  await el.press('Enter');
  await el.press('Tab');
  await el.type('Definition description');
  await expect(page.locator('dl > dd')).toHaveCount(1);
});

test('Selecting multiple paragraphs gives multiple terms', async ({ page }) => {
  const el = page.locator('[data-cy="slate-editor"]');
  await el.click();
  await el.type('Definition term 1');
  await el.press('Enter');
  await el.type('Definition term 2');
  await el.press('Enter');
  await el.type('Definition term 3');
  await el.press('Enter');
  await el.press(`${metaKey}+A`);
  const definitionList = page.getByTestId('toolbar-button-definition-list');
  await definitionList.click();
  await expect(definitionList).toHaveAttribute('data-active', 'true');
  await expect(page.locator('dl > dt')).toHaveCount(3);
});

test('Creates math', async ({ page }) => {
  const el = page.locator('[data-cy="slate-editor"]');
  await el.click();
  await el.type('1+1');
  await el.press(`${metaKey}+A`);
  const math = page.getByTestId('toolbar-button-mathml');
  await math.click();
  await expect(page.locator('[data-cy="math"]')).toBeVisible();
});
