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
    fixture: 'language_handling_licenses',
  });

  const zendesk = mockRoute({
    page,
    path: '**/get_zendesk_token',
    fixture: 'language_handling_zendesk_token',
    overrideValue: JSON.stringify(zendeskMock),
  });

  const statuses = mockRoute({
    page,
    path: '**/draft-api/v1/drafts/status-state-machine/*',
    fixture: 'language_handling_status_state_machine',
  });

  const responsibles = mockRoute({
    page,
    path: '**/get_responsibles?permission=drafts:responsible',
    fixture: 'language_handling_responsibles',
    overrideValue: JSON.stringify(responsiblesMock),
  });

  const userData = mockRoute({
    page,
    path: '**/draft-api/v1/user-data',
    fixture: 'language_handling_user_data',
    overrideValue: JSON.stringify(userDataMock),
  });

  const draftHistory = mockRoute({
    page,
    path: '**/draft-api/v1/drafts/800/history*',
    fixture: 'language_handling_draft_history',
    overrideValue: (val) =>
      JSON.stringify(JSON.parse(val).map((draft) => ({ ...draft, copyright: copyrightMock }))),
  });

  const draftData = mockRoute({
    page,
    path: '**/draft-api/v1/drafts/800*',
    fixture: 'language_handling_draft_nb',
    overrideValue: (val) => JSON.stringify({ ...JSON.parse(val), copyright: copyrightMock }),
  });

  const draftValidate = mockRoute({
    page,
    path: '**/draft-api/v1/drafts/800/validate/',
    fixture: 'language_handling_draft_validate',
  });

  const taxonomyNodes = mockRoute({
    page,
    path: '**/taxonomy/v1/nodes*',
    fixture: 'language_handling_taxonomy_nodes',
  });

  const searchApi = mockRoute({
    page,
    path: '**/search-api/v1/search/editorial/**',
    fixture: 'language_handling_usage_search',
  });

  const containsArticle = mockRoute({
    page,
    path: '**/learningpath-api/v2/learningpaths/contains-article/800',
    fixture: 'language_handling_contains_article',
  });

  const getNoteUsers = mockRoute({
    page,
    path: '**/get_note_users*',
    fixture: 'language_handling_get_note_users',
    overrideValue: JSON.stringify(getNoteUsersMock),
  });

  page.goto(`/subject-matter/learning-resource/800/edit/nb`);
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
  ]);
});

test('Can change language and fech new article', async ({ page }) => {
  await page.getByText('Legg til språk').click();
  await page.getByText('Engelsk').click();
  await expect(page.getByText('Engelsk')).toBeVisible();
});
