/**
 * Copyright (c) 2023-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { test, expect } from '@playwright/test';
import { mockRoute } from '../apiMock';
import { userDataMock, responsiblesMock, zendeskMock } from '../mockResponses';

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

  const statuses = mockRoute({
    page,
    path: '**/draft-api/v1/drafts/status-state-machine/*',
    fixture: 'editor_status_state_machine',
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
    fixture: 'editor_draft_data',
  });

  const draftUpdate = mockRoute({
    page,
    path: '**/draft-api/v1/drafts/800',
    fixture: 'editor_draft_update',
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

  await page.goto(`/subject-matter/learning-resource/800/edit/nb`);
  await Promise.all([
    licenses,
    zendesk,
    statuses,
    responsibles,
    userData,
    draftData,
    draftUpdate,
    draftValidate,
    draftHistory,
    taxonomyResources,
    taxonomyTopics,
    searchApi,
    containsArticle,
  ]);
});

test('can enter title, ingress, content and responsible then save', async ({ page }) => {
  const userData = mockRoute({
    page,
    path: '**/draft-api/v1/user-data',
    fixture: 'editor_user_data',
    overrideValue: JSON.stringify(userDataMock),
  });

  const draftUpdate = mockRoute({
    page,
    path: '**/draft-api/v1/drafts/800',
    fixture: 'editor_draft_update',
  });

  await expect(
    page.locator('[data-testid="saveLearningResourceButtonWrapper"]').getByRole('button').first(),
  ).toBeDisabled();
  await page.locator('[data-cy="learning-resource-title"]').click();
  await page.keyboard.type('TITTEL');
  await page.locator('[data-cy="learning-resource-ingress"]').click();
  await page.keyboard.type('INGRESS');
  await page.locator('[data-cy="slate-editor"]').click();
  await page.keyboard.type('CONTENT');
  await page.locator('[data-cy="responsible-select"]').click();
  await page.keyboard.type('Test user');
  await page.keyboard.press('Enter');
  await page
    .locator('[data-testid="saveLearningResourceButtonWrapper"]')
    .getByRole('button')
    .first()
    .click();
  await userData;
  await draftUpdate;
  await expect(
    page
      .locator('[data-testid="saveLearningResourceButtonWrapper"]')
      .getByRole('button')
      .getByText('Lagret'),
  ).toHaveCount(1);
});

test('Can add all contributors', async ({ page }) => {
  await page.getByRole('heading').getByRole('button').getByText('Lisens og bruker').click();
  const contributorValues = ['originator', 'rightsholder', 'processor'];
  let index = 0;
  for (const contrib of await page.locator('[data-cy="addContributor"]').all()) {
    await contrib.click();
    await page.keyboard.type('Test user');
    await page
      .locator('[data-cy="contributor-selector"]')
      .last()
      .selectOption(contributorValues[index]);
    index === 0 &&
      expect(page.locator('[data-cy="contributor-selector"]').first()).toHaveValue('writer');
    index++;
  }
});