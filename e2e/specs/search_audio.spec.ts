/**
 * Copyright (c) 2023-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { test, expect } from '@playwright/test';
import { mockRoute, mockWaitResponse } from '../apiMock';
import { userDataMock, zendeskMock } from '../mockResponses';

test.beforeEach(async ({ page }) => {
  const licenses = mockRoute({
    page,
    path: '**/draft-api/v1/drafts/licenses/',
    fixture: 'search_audio_licenses',
  });

  const allSubjects = mockRoute({
    page,
    path: '**/taxonomy/v1/nodes?language=nb&nodeType=SUBJECT',
    fixture: 'search_audio_all_subjects',
  });

  const search = mockRoute({
    page,
    path: '**/audio-api/v1/audio/?exclude-revision-log=false&fallback=false&filter-inactive=true&include-other-statuses=false&page=1&page-size=10&sort=-relevance*',
    fixture: 'search_audio_search',
  });

  const searchNextPage = mockRoute({
    page,
    path: '**/audio-api/v1/audio/?exclude-revision-log=false&fallback=false&filter-inactive=true&include-other-statuses=false&page=2&page-size=10&sort=-relevance*',
    fixture: 'search_audio_next_search',
  });

  const zendesk = mockRoute({
    page,
    path: '**/get_zendesk_token',
    fixture: 'search_zendesk_token',
    overrideValue: JSON.stringify(zendeskMock),
  });

  const notesUser = mockRoute({
    page,
    path: '**/get_note_users?*',
    fixture: 'search_note_users',
  });

  const userData = mockRoute({
    page,
    path: '**/user-data*',
    fixture: 'search_user_data',
    overrideValue: JSON.stringify(userDataMock),
  });

  await page.goto('/search/audio?page=1&page-size=10&sort=-relevance');
  await Promise.all([licenses, allSubjects, search, searchNextPage, zendesk, notesUser, userData]);
});

const totalSearchCount = '3291';

test.afterEach(async ({ page }) => mockWaitResponse(page, '**/audio-api/v1/audio/?*'));

test('Can use text input', async ({ page }) => {
  await mockRoute({
    page,
    path: '**/audio-api/v1/audio/?*query=Test*',
    fixture: 'search_audio_query',
  });
  await page.locator('input[name="query"]').fill('Test');
  await page.getByRole('button', { name: 'Søk', exact: true }).click();
  await page.getByTestId('audio-search-result').first().waitFor();
  expect(await page.getByTestId('searchTotalCount').innerText()).toEqual('34');
  await page.locator('input[name="query"]').clear();
  await page.getByRole('button', { name: 'Søk', exact: true }).click();
  await page.getByTestId('audio-search-result').first().waitFor();
  expect(await page.getByTestId('searchTotalCount').innerText()).toEqual(totalSearchCount);
});

test('Can use audiotype dropdown', async ({ page }) => {
  await mockRoute({
    page,
    path: '**/audio-api/v1/audio/?*audio-type=podcast*',
    fixture: 'search_audio_type',
  });
  await page.locator('select[name="audio-type"]').selectOption({ label: 'Podkast' });
  await page.getByTestId('audio-search-result').first().waitFor();
  expect(await page.getByTestId('searchTotalCount').innerText()).toEqual('114');
  await page.locator('select[name="audio-type"]').selectOption({ label: 'Velg lydfiltype' });
  await page.getByTestId('audio-search-result').first().waitFor();
  expect(await page.getByTestId('searchTotalCount').innerText()).toEqual(totalSearchCount);
});

test('Can use language dropdown', async ({ page }) => {
  await mockRoute({
    page,
    path: '**/audio-api/v1/audio/?*language=en*',
    fixture: 'search_audio_lang',
  });
  await page.locator('select[name="language"]').selectOption({ label: 'Engelsk' });
  await page.getByTestId('audio-search-result').first().waitFor();
  expect(await page.getByTestId('searchTotalCount').innerText()).toEqual('315');
  await page.locator('select[name="language"]').selectOption({ label: 'Velg språk' });
  await page.getByTestId('audio-search-result').first().waitFor();
  expect(await page.getByTestId('searchTotalCount').innerText()).toEqual(totalSearchCount);
});
