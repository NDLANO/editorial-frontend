/**
 * Copyright (c) 2019-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { test, expect } from '@playwright/test';
import { mockRoute } from '../apiMock';
import { zendeskMock, responsiblesMock, userDataMock } from '../mockResponses';

test.beforeEach(async ({ page }) => {
  const licenses = mockRoute({
    page,
    path: '**/draft-api/v1/drafts/licenses/',
    fixture: 'editor_licenses',
  });

  const zendesk = mockRoute({
    page,
    path: '**/get_zendesk_token',
    fixture: 'editor_zendesk_token',
    overrideValue: JSON.stringify(zendeskMock),
  });

  const responsibles = mockRoute({
    page,
    path: '**/get_responsibles?permission=drafts:responsible',
    fixture: 'editor_responsibles',
    overrideValue: JSON.stringify(responsiblesMock),
  });

  const userData = mockRoute({
    page,
    path: '**/draft-api/v1/user-data',
    fixture: 'editor_user_data',
    overrideValue: JSON.stringify(userDataMock),
  });

  const draftHistory = mockRoute({
    page,
    path: '**/draft-api/v1/drafts/800/history?language=nb&fallback=true',
    fixture: 'editor_draft_history',
  });

  const draftData = mockRoute({
    page,
    path: '**/draft-api/v1/drafts/800*',
    fixture: 'editor_draft_published',
  });

  const draftValidate = mockRoute({
    page,
    path: '**/draft-api/v1/drafts/800/validate/',
    fixture: 'editor_draft_validate',
  });

  const taxonomyResources = mockRoute({
    page,
    path: '**/taxonomy/v1/resources*',
    fixture: 'editor_taxonomy_resources',
  });
  const taxonomyTopics = mockRoute({
    page,
    path: '**/taxonomy/v1/topics*',
    fixture: 'editor_taxonomy_topics',
  });

  const searchApi = mockRoute({
    page,
    path: '**/search-api/v1/search/editorial/**',
    fixture: 'editor_usage_search',
  });

  const containsArticle = mockRoute({
    page,
    path: '**/learningpath-api/v2/learningpaths/contains-article/800',
    fixture: 'editor_contains_article',
  });

  const statusMachine = mockRoute({
    page,
    path: '**/draft-api/v1/drafts/status-state-machine/*',
    fixture: 'editor_status_machine',
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
    taxonomyResources,
    taxonomyTopics,
    searchApi,
    containsArticle,
  ]);
});

test('can change status correctly', async ({ page }) => {
  test.slow();
  await page.getByTestId('status-select').click();
  await page.locator('*[id^="react-select-3-option"]', { hasText: 'I arbeid' }).click();
  await page.locator('[data-cy=responsible-select]').click();
  await page.keyboard.type('Test user');
  await page.keyboard.press('Enter');

  await page.unroute('**/draft-api/v1/drafts/800*');
  await mockRoute({
    page,
    path: '**/draft-api/v1/drafts/800*',
    fixture: 'editor_draft_in_progress',
  });

  await page.getByTestId('saveLearningResourceButtonWrapper').getByRole('button').first().click();
  await page.getByTestId('status-select').click();
  await page.locator('*[id^="react-select-3-option"]', { hasText: 'Sisteblikk' }).click();

  await page.unroute('**/draft-api/v1/drafts/800*');
  await mockRoute({
    page,
    path: '**/draft-api/v1/drafts/800*',
    fixture: 'editor_draft_internal_review',
  });
  await page.getByTestId('saveLearningResourceButtonWrapper').getByRole('button').first().click();
  await page.getByTestId('status-select').click();
  await page.unroute('**/draft-api/v1/drafts/800*');
  await mockRoute({
    page,
    path: '**/draft-api/v1/drafts/800*',
    fixture: 'editor_draft_published',
  });
  await page.locator('*[id^="react-select-3-option"]', { hasText: 'Publiser' }).click();
  expect(
    await page
      .getByTestId('saveLearningResourceButtonWrapper')
      .getByRole('button')
      .first()
      .textContent(),
  ).toEqual('Lagrer...');
});
