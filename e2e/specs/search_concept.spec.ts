/**
 * Copyright (c) 2023-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { test, expect } from '@playwright/test';
import { mockRoute, mockWaitResponse } from '../apiMock';
import {
  responsiblesMock,
  userDataMock,
  zendeskMock,
  getNoteUsersMock,
  editorMock,
} from '../mockResponses';

test.beforeEach(async ({ page }) => {
  const licenses = mockRoute({
    page,
    path: '**/draft-api/v1/drafts/licenses/',
    fixture: 'search_concept_licenses',
  });

  const subjects = mockRoute({
    page,
    path: '**/taxonomy/v1/nodes?language=nb&nodeType=SUBJECT',
    fixture: 'search_concept_subjects',
  });

  const getEditors = mockRoute({
    page,
    path: '**/get_editors',
    fixture: 'search_concept_get_editors',
    overrideValue: JSON.stringify(editorMock),
  });

  const searchConcept = mockRoute({
    page,
    path: '**/concept-api/v1/drafts/?exclude-revision-log=false&fallback=false&filter-inactive=true&include-other-statuses=false&page=1&page-size=10&sort=-lastUpdated',
    fixture: 'search_concept_search',
  });

  const searchNextPage = mockRoute({
    page,
    path: '**/concept-api/v1/drafts/?exclude-revision-log=false&fallback=false&filter-inactive=true&include-other-statuses=false&page=2&page-size=10&sort=-lastUpdated',
    fixture: 'search_concept_next_search',
  });

  const zendesk = mockRoute({
    page,
    path: '**/get_zendesk_token',
    fixture: 'search_concept_zendesk_token',
    overrideValue: JSON.stringify(zendeskMock),
  });

  const noteUsers = mockRoute({
    page,
    path: '**/get_note_users?*',
    fixture: 'search_concept_note_users',
    overrideValue: JSON.stringify(getNoteUsersMock),
  });

  const userData = mockRoute({
    page,
    path: '**/draft-api/v1/user-data',
    fixture: 'search_concept_user_data',
    overrideValue: JSON.stringify(userDataMock),
  });

  const responsibles = mockRoute({
    page,
    path: '**/get_responsibles*',
    fixture: 'search_concept_responsibles',
    overrideValue: JSON.stringify(responsiblesMock),
  });

  const statusStateMachine = mockRoute({
    page,
    path: '**/concept-api/v1/drafts/status-state-machine/',
    fixture: 'search_concept_status_state_machine',
  });

  await page.goto('/search/concept?page=1&page-size=10&sort=-lastUpdated');

  await Promise.all([
    licenses,
    statusStateMachine,
    searchConcept,
    subjects,
    noteUsers,
    responsibles,
    zendesk,
    userData,
    searchNextPage,
    getEditors,
  ]);
});

const totalSearchCount = '4901';

test.afterEach(async ({ page }) => mockWaitResponse(page, '**/concept-api/v1/drafts/?*'));

test('Can use text input', async ({ page }) => {
  await mockRoute({
    page,
    path: '**/concept-api/v1/drafts/?exclude-revision-log=false&fallback=false&filter-inactive=true&include-other-statuses=false&page=*&page-size=10&query=Test&sort=-lastUpdated*',
    fixture: 'search_concept_query_search',
  });
  await page.locator('input[name="query"]').fill('Test');
  await page.getByRole('button', { name: 'Søk', exact: true }).click();
  await page.getByTestId('concept-search-result').first().waitFor();
  expect(await page.getByTestId('searchTotalCount').innerText()).toEqual('76');
  await page.locator('input[name="query"]').clear();
  await page.getByRole('button', { name: 'Søk', exact: true }).click();
  await page.getByTestId('concept-search-result').first().waitFor();
  expect(await page.getByTestId('searchTotalCount').innerText()).toEqual(totalSearchCount);
});

test('Can use status dropdown', async ({ page }) => {
  await mockRoute({
    page,
    path: '**/concept-api/v1/drafts/?exclude-revision-log=false&fallback=false&filter-inactive=true&include-other-statuses=false&page=*&page-size=10&sort=-lastUpdated&status=IN_PROGRESS',
    fixture: 'search_concept_status_search',
  });
  await page.locator('select[name="status"]').selectOption({ index: 1 });
  await page.getByTestId('concept-search-result').first().waitFor();
  expect(await page.getByTestId('searchTotalCount').innerText()).toEqual('973');
  await page.locator('select[name="status"]').selectOption({ index: 0 });
  await page.getByTestId('concept-search-result').first().waitFor();
  expect(await page.getByTestId('searchTotalCount').innerText()).toEqual(totalSearchCount);
});

test('Can use language dropdown', async ({ page }) => {
  await mockRoute({
    page,
    path: '**/concept-api/v1/drafts/?exclude-revision-log=false&fallback=false&filter-inactive=true&include-other-statuses=false&language=en&page=*&page-size=10&sort=-lastUpdated',
    fixture: 'search_concept_lang_search',
  });
  await page.locator('select[name="language"]').selectOption({ label: 'Engelsk' });
  await page.getByTestId('concept-search-result').first().waitFor();
  expect(await page.getByTestId('searchTotalCount').innerText()).toEqual('35');
  await page.locator('select[name="language"]').selectOption({ index: 0 });
  await page.getByTestId('concept-search-result').first().waitFor();
  expect(await page.getByTestId('searchTotalCount').innerText()).toEqual(totalSearchCount);
});

test('Can use subject dropdown', async ({ page }) => {
  await mockRoute({
    page,
    path: '**/concept-api/v1/drafts/?exclude-revision-log=false&fallback=false&filter-inactive=true&include-other-statuses=false&page=*&page-size=10&sort=-lastUpdated&subjects=urn%3Asubject%3Af665de3e-65dc-478e-b736-cb0af3d38ad4',
    fixture: 'search_concept_subjects_search',
  });
  await page.locator('select[name="subjects"]').selectOption({ index: 3 });
  await page.getByTestId('concept-search-result').first().waitFor();
  expect(await page.getByTestId('searchTotalCount').innerText()).toEqual('369');
  await page.locator('select[name="subjects"]').selectOption({ index: 0 });
  await page.getByTestId('concept-search-result').first().waitFor();
  expect(await page.getByTestId('searchTotalCount').innerText()).toEqual(totalSearchCount);
});

test('Can use responsible dropdown', async ({ page }) => {
  await mockRoute({
    page,
    path: '**/concept-api/v1/drafts/?exclude-revision-log=false&fallback=false&filter-inactive=true&include-other-statuses=false&page=*&page-size=10&responsible-ids=Gxfx7B-MXoFdgVZZ6p611C6w&sort=-lastUpdated',
    fixture: 'search_concept_responsible_search',
  });
  await page.locator('select[name="responsible-ids"]').selectOption({ label: 'Ed Test' });
  await page.getByTestId('concept-search-result').first().waitFor();
  expect(await page.getByTestId('searchTotalCount').innerText()).toEqual('12');
  await page.locator('select[name="responsible-ids"]').selectOption({ index: 0 });
  await page.getByTestId('concept-search-result').first().waitFor();
  expect(await page.getByTestId('searchTotalCount').innerText()).toEqual(totalSearchCount);
});

test('Can use user dropdown', async ({ page }) => {
  await mockRoute({
    page,
    path: '**/concept-api/v1/drafts/?exclude-revision-log=false&fallback=false&filter-inactive=true&include-other-statuses=false&page=*&page-size=10&sort=-lastUpdated&users=%22Gxfx7B-MXoFdgVZZ6p611C6w%22',
    fixture: 'search_concept_users_search',
  });
  await page.locator('select[name="users"]').selectOption({ label: 'Ed Test' });
  await page.getByTestId('concept-search-result').first().waitFor();
  expect(await page.getByTestId('searchTotalCount').innerText()).toEqual('18');
  await page.locator('select[name="users"]').selectOption({ index: 0 });
  await page.getByTestId('concept-search-result').first().waitFor();
  expect(await page.getByTestId('searchTotalCount').innerText()).toEqual(totalSearchCount);
});
