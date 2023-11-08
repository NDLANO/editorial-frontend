/**
 * Copyright (c) 2023-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { test, expect } from '@playwright/test';
import { mockGraphqlRoute, mockRoute } from '../apiMock';
import {
  zendeskMock,
  responsiblesMock,
  userDataMock,
  getNoteUsersMock,
  copyrightMock,
} from '../mockResponses';

test.beforeEach(async ({ page }) => {
  const licenses = mockRoute({
    page,
    path: '**/draft-api/v1/drafts/licenses/',
    fixture: 'version_licenses',
  });

  const zendesk = mockRoute({
    page,
    path: '**/get_zendesk_token',
    fixture: 'version_zendesk_token',
    overrideValue: JSON.stringify(zendeskMock),
  });

  const statuses = mockRoute({
    page,
    path: '**/draft-api/v1/drafts/status-state-machine/*',
    fixture: 'version_status_state_machine',
  });

  const responsibles = mockRoute({
    page,
    path: '**/get_responsibles?permission=drafts:responsible',
    fixture: 'version_responsibles',
    overrideValue: JSON.stringify(responsiblesMock),
  });

  const userData = mockRoute({
    page,
    path: '**/draft-api/v1/user-data',
    fixture: 'version_user_data',
    overrideValue: JSON.stringify(userDataMock),
  });

  const draftHistory = mockRoute({
    page,
    path: '**/draft-api/v1/drafts/800/history?language=nb&fallback=true',
    fixture: 'version_draft_history',
    overrideValue: (val) =>
      JSON.stringify(JSON.parse(val).map((draft) => ({ ...draft, copyright: copyrightMock }))),
  });

  const draftData = mockRoute({
    page,
    path: '**/draft-api/v1/drafts/800*',
    fixture: 'version_draft_data',
    overrideValue: (val) => JSON.stringify({ ...JSON.parse(val), copyright: copyrightMock }),
  });

  const draftValidate = mockRoute({
    page,
    path: '**/draft-api/v1/drafts/800/validate/',
    fixture: 'version_draft_validate',
  });

  const taxonomyNodes = mockRoute({
    page,
    path: '**/taxonomy/v1/nodes*',
    fixture: 'version_taxonomy_nodes',
  });

  const searchApi = mockRoute({
    page,
    path: '**/search-api/v1/search/versionial/**',
    fixture: 'version_usage_search',
  });

  const containsArticle = mockRoute({
    page,
    path: '**/learningpath-api/v2/learningpaths/contains-article/800',
    fixture: 'version_contains_article',
  });

  const getNoteUsers = mockRoute({
    page,
    path: '**/get_note_users*',
    fixture: 'version_get_note_users',
    overrideValue: JSON.stringify(getNoteUsersMock),
  });

  const searchApiEditorial = mockRoute({
    page,
    path: '**/search-api/v1/search/editorial/*',
    fixture: 'version_search_api',
  });

  await page.goto(`/subject-matter/learning-resource/800/edit/nb`);
  await Promise.all([
    licenses,
    zendesk,
    statuses,
    responsibles,
    userData,
    draftData,
    draftValidate,
    draftHistory,
    taxonomyNodes,
    searchApi,
    containsArticle,
    getNoteUsers,
    searchApiEditorial,
  ]);
});

test('can add notes then save', async ({ page }) => {
  await page.getByRole('heading', { name: 'Versjonslogg og merknader' }).click();
  await expect(page.getByTestId('addNote')).toBeVisible();
  await page.getByTestId('addNote').click();
  await page.getByTestId('notesInput').click();
  await page.keyboard.type('Test merknad');
  const draftPatchData = mockRoute({
    page,
    overrideRoute: true,
    path: '**/draft-api/v1/drafts/800*',
    fixture: 'version_draft_patch_data',
    overrideValue: (val) => JSON.stringify({ ...JSON.parse(val), copyright: copyrightMock }),
  });

  const saveButton = page.getByTestId('saveLearningResourceButtonWrapper').first();

  await saveButton.click();

  await Promise.all([draftPatchData]);

  const userData = mockRoute({
    page,
    path: '**/draft-api/v1/user-data',
    overrideRoute: true,
    fixture: 'version_user_data',
    overrideValue: JSON.stringify(userDataMock),
  });

  const draftData = mockRoute({
    page,
    overrideRoute: true,
    path: '**/draft-api/v1/drafts/800*',
    fixture: 'version_draft_patch_data',
    overrideValue: (val) => JSON.stringify({ ...JSON.parse(val), copyright: copyrightMock }),
  });

  const draftHistory = mockRoute({
    page,
    path: '**/draft-api/v1/drafts/800/history?language=nb&fallback=true',
    overrideRoute: true,
    fixture: 'version_draft_patched_history',
    overrideValue: (val) =>
      JSON.stringify(JSON.parse(val).map((draft) => ({ ...draft, copyright: copyrightMock }))),
  });

  const getNoteUsers = mockRoute({
    page,
    overrideRoute: true,
    path: '**/get_note_users*',
    fixture: 'version_get_note_users',
    overrideValue: JSON.stringify(getNoteUsersMock),
  });

  await Promise.all([draftData, userData, getNoteUsers, draftHistory]);

  await expect(page.getByTestId('saveLearningResourceButtonWrapper').first()).toHaveText('Lagret');

  await expect(page.locator('table')).toBeVisible();

  expect(await page.locator('table').locator('tr').count()).toEqual(25);
});

test('Open previews', async ({ page }) => {
  await mockGraphqlRoute({
    page,
    operationNames: ['transformArticle'],
    fixture: 'version_grapqhl',
  });

  await page.getByRole('heading', { name: 'Versjonslogg og merknader' }).click();
  await page.getByTestId('previewVersion').last().click();
  await page.getByRole('article').first().waitFor();
  await expect(page.getByTestId('close-modal-button')).toBeVisible();
  expect(await page.getByRole('article').count()).toBe(2);
  await page.getByTestId('close-modal-button').click();
  await expect(page.getByTestId('preview-draft-modal')).toBeVisible({ visible: false });
});

test('Can reset to prod', async ({ page }) => {
  await page.getByRole('heading', { name: 'Versjonslogg og merknader' }).click();
  await page.getByTestId('resetToVersion').first().click();
  await expect(page.getByText('Innhold er tilbakestilt')).toBeVisible();
});
