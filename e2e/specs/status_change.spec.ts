/**
 * Copyright (c) 2023-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { test, expect } from '@playwright/test';
import { mockRoute } from '../apiMock';
import {
  zendeskMock,
  responsiblesMock,
  userDataMock,
  copyrightMock,
  getNoteUsersMock,
} from '../mockResponses';

test.beforeEach(async ({ page }) => {
  const licenses = mockRoute({
    page,
    path: '**/draft-api/v1/drafts/licenses/',
    fixture: 'status_changer_licenses',
  });

  const zendesk = mockRoute({
    page,
    path: '**/get_zendesk_token',
    fixture: 'status_changer_zendesk_token',
    overrideValue: JSON.stringify(zendeskMock),
  });

  const responsibles = mockRoute({
    page,
    path: '**/get_responsibles?permission=drafts:responsible',
    fixture: 'status_changer_responsibles',
    overrideValue: JSON.stringify(responsiblesMock),
  });

  const userData = mockRoute({
    page,
    path: '**/draft-api/v1/user-data',
    fixture: 'status_changer_user_data',
    overrideValue: JSON.stringify(userDataMock),
  });

  const draftHistory = mockRoute({
    page,
    path: '**/draft-api/v1/drafts/800/history?language=nb&fallback=true',
    fixture: 'status_changer_draft_history',
  });

  const draftData = mockRoute({
    page,
    path: '**/draft-api/v1/drafts/800*',
    fixture: 'status_changer_draft_published',
    overrideValue: overrideCopyright,
  });

  const draftValidate = mockRoute({
    page,
    path: '**/draft-api/v1/drafts/800/validate/',
    fixture: 'status_changer_draft_validate',
  });

  const taxonomyNodes = mockRoute({
    page,
    path: '**/taxonomy/v1/nodes*',
    fixture: 'status_changer_taxonomy_nodes',
  });

  const containsArticle = mockRoute({
    page,
    path: '**/learningpath-api/v2/learningpaths/contains-article/800',
    fixture: 'status_changer_contains_article',
  });

  const statusMachine = mockRoute({
    page,
    path: '**/draft-api/v1/drafts/status-state-machine/*',
    fixture: 'status_changer_status_machine',
  });

  const searchApiEditorial = mockRoute({
    page,
    path: '**/search-api/v1/search/editorial/*',
    fixture: 'status_changer_search_editorial',
  });

  const getNoteUser = mockRoute({
    page,
    path: '**/get_note_users*',
    fixture: 'status_changer_get_note_users',
    overrideValue: JSON.stringify(getNoteUsersMock),
  });

  await page.goto('/subject-matter/learning-resource/800/edit/nb');

  await Promise.all([
    licenses,
    zendesk,
    statusMachine,
    responsibles,
    userData,
    draftHistory,
    draftData,
    draftValidate,
    taxonomyNodes,
    containsArticle,
    searchApiEditorial,
    getNoteUser,
  ]);
});

test('can change status correctly', async ({ page }) => {
  const statusSelect = page.getByTestId('status-select');
  const saveButton = page
    .getByTestId('saveLearningResourceButtonWrapper')
    .getByRole('button')
    .first();

  await statusSelect.click();
  await page.locator('*[id^="react-select-3-option"]', { hasText: 'I arbeid' }).click();
  await page.getByTestId('alert-modal').getByRole('button', { name: 'Fortsett' }).click();
  await page.getByTestId('responsible-select').click();
  await page.keyboard.type('Ed test');
  await page.keyboard.press('Enter');

  await mockRoute({
    page,
    path: '**/draft-api/v1/drafts/800*',
    fixture: 'status_changer_draft_in_progress',
    overrideRoute: true,
    overrideValue: overrideCopyright,
  });

  await saveButton.click();
  await saveButton.getByText('Lagret').waitFor();
  await expect(statusSelect.getByText('I arbeid')).toBeVisible();

  await mockRoute({
    page,
    path: '**/draft-api/v1/drafts/800*',
    fixture: 'status_changer_draft_internal_review',
    overrideRoute: true,
    overrideValue: overrideCopyright,
  });

  await statusSelect.click();
  await page.locator('*[id^="react-select-3-option"]', { hasText: 'Sisteblikk' }).click();
  await saveButton.click();
  await saveButton.getByText('Lagret').waitFor();
  await expect(statusSelect.getByText('Sisteblikk')).toBeVisible();

  await mockRoute({
    page,
    path: '**/draft-api/v1/drafts/800*',
    fixture: 'status_changer_draft_published',
    overrideRoute: true,
    overrideValue: overrideCopyright,
  });

  await statusSelect.click();
  await page.locator('*[id^="react-select-3-option"]', { hasText: 'Publiser' }).click();

  await saveButton.getByText('Lagret').waitFor();
  await expect(statusSelect.getByText('Publisert')).toBeVisible();
});

const overrideCopyright = (value: string) =>
  JSON.stringify({
    ...JSON.parse(value),
    copyright: copyrightMock,
  });
