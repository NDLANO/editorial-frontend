/**
 * Copyright (c) 2023-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { test, expect } from '@playwright/test';
import { response } from 'express';
import { mockRoute } from '../apiMock';
import { responsiblesMock, userDataMock, zendeskMock } from '../mockResponses';

test.beforeEach(async ({ page }) => {
  const zendesk = mockRoute({
    page,
    path: '**/get_zendesk_token',
    fixture: 'concept_zendesk_token',
    overrideValue: JSON.stringify(zendeskMock),
  });

  const conceptDefault = mockRoute({
    page,
    path: '**/concept-api/v1/drafts/1?fallback=true',
    fixture: 'concept_draft',
  });

  const userData = mockRoute({
    page,
    path: '**/draft-api/v1/user-data',
    fixture: 'concept_user_data',
    overrideValue: JSON.stringify(userDataMock),
  });

  const conceptNb = mockRoute({
    page,
    path: '**/concept-api/v1/drafts/1?language=nb&fallback=true',
    fixture: 'concept_draft_nb',
  });

  const subjects = mockRoute({
    page,
    path: '**/taxonomy/v1/subjects?key=forklaringsfag&language=nb&value=true',
    fixture: 'concept_subjects',
  });

  const noteUsers = mockRoute({
    page,
    path: '**/get_note_users?userIds=*',
    fixture: 'concept_note_users',
  });

  const responsibles = mockRoute({
    page,
    path: '**/get_responsibles?permission=drafts:responsible',
    fixture: 'concept_responsibles',
    overrideValue: JSON.stringify(responsiblesMock),
  });

  const usageSearch = mockRoute({
    page,
    path: '**/search-api/v1/search/editorial/?embed-id=1&embed-resource=concept&page-size=50',
    fixture: 'concept_usage_search',
  });

  const statusStateMachine = mockRoute({
    page,
    path: '**/concept-api/v1/drafts/status-state-machine/',
    fixture: 'concept_status_state_machine',
  });

  const licenses = mockRoute({
    page,
    path: '**/concept-api/v1/drafts/licenses/',
    fixture: 'concept_licenses',
  });

  const subject = mockRoute({
    page,
    path: '**/taxonomy/v1/subjects/urn:subject:1:5f50e974-6251-42c7-8f04-c4fabf395d0f?language=nb',
    fixture: 'concept_subject',
  });

  await page.goto('/concept/1/edit/nb');

  await Promise.all([
    subject,
    licenses,
    statusStateMachine,
    usageSearch,
    response,
    subjects,
    noteUsers,
    responsibles,
    conceptNb,
    conceptDefault,
    zendesk,
    userData,
  ]);
});

test('Can change language and fetch new concept', async ({ page }) => {
  const conceptEn = mockRoute({
    page,
    path: '**/concept-api/v1/drafts/1?language=en&fallback=true',
    fixture: 'concept_draft_en',
  });

  const subjects = mockRoute({
    page,
    path: '**/taxonomy/v1/subjects?key=forklaringsfag&language=en&value=true',
    fixture: 'concept_subjects',
  });

  const responsibles = mockRoute({
    page,
    path: '**/get_responsibles?permission=drafts:responsible',
    fixture: 'concept_responsibles',
    overrideValue: JSON.stringify(responsiblesMock),
  });

  const statusStateMachine = mockRoute({
    page,
    path: '**/concept-api/v1/drafts/status-state-machine/',
    fixture: 'concept_status_state_machine',
  });

  const usageSearch = mockRoute({
    page,
    path: '**/search-api/v1/search/editorial/?embed-id=1&embed-resource=concept&page-size=50',
    fixture: 'concept_usage_search',
  });

  await page.getByRole('button').getByText('Legg til språk').click();
  await page.getByText('Engelsk').click();

  await Promise.all([conceptEn, subjects, responsibles, statusStateMachine, usageSearch]);
  await expect(page.getByText('Engelsk')).toBeVisible();
});
