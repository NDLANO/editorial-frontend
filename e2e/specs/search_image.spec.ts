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
  copyrightMock,
  editorMock,
  responsiblesMock,
  userDataMock,
  zendeskMock,
} from '../mockResponses';

const imageCopyrightMock = (val: any) =>
  JSON.stringify({
    ...JSON.parse(val),
    results: JSON.parse(val).results.map((image) => ({ ...image, copyright: copyrightMock })),
  });

test.beforeEach(async ({ page }) => {
  const licenses = mockRoute({
    page,
    path: '**/draft-api/v1/drafts/licenses/',
    fixture: 'search_image_licenses',
  });

  const subjects = mockRoute({
    page,
    path: '**/taxonomy/v1/nodes?language=nb&nodeType=SUBJECT',
    fixture: 'search_image_subjects',
  });

  const getEditors = mockRoute({
    page,
    path: '**/get_editors',
    fixture: 'search_image_get_editors',
    overrideValue: JSON.stringify(editorMock),
  });

  const searchimage = mockRoute({
    page,
    path: '**/image-api/v3/images/?exclude-revision-log=false&fallback=false&filter-inactive=true&include-other-statuses=false&page=1&page-size=10&sort=-relevance',
    fixture: 'search_image_search',
    overrideValue: imageCopyrightMock,
  });

  const searchNextPage = mockRoute({
    page,
    path: '**/image-api/v3/images/?exclude-revision-log=false&fallback=false&filter-inactive=true&include-other-statuses=false&page=2&page-size=10&sort=-relevance',
    fixture: 'search_image_next_search',
    overrideValue: imageCopyrightMock,
  });

  const zendesk = mockRoute({
    page,
    path: '**/get_zendesk_token',
    fixture: 'search_image_zendesk_token',
    overrideValue: JSON.stringify(zendeskMock),
  });

  const noteUsers = mockRoute({
    page,
    path: '**/get_note_users?*',
    fixture: 'search_image_note_users',
  });

  const userData = mockRoute({
    page,
    path: '**/draft-api/v1/user-data',
    fixture: 'search_image_user_data',
    overrideValue: JSON.stringify(userDataMock),
  });

  const responsibles = mockRoute({
    page,
    path: '**/get_responsibles*',
    fixture: 'search_image_responsibles',
    overrideValue: JSON.stringify(responsiblesMock),
  });

  const statusStateMachine = mockRoute({
    page,
    path: '**/image-api/v3/drafts/status-state-machine/',
    fixture: 'search_image_status_state_machine',
  });

  await page.goto('/search/image?page=1&page-size=10&sort=-relevance');

  await Promise.all([
    licenses,
    statusStateMachine,
    searchimage,
    subjects,
    noteUsers,
    responsibles,
    zendesk,
    userData,
    searchNextPage,
    getEditors,
  ]);
});

test.afterEach(async ({ page }) => await mockWaitResponse(page, '**/image-api/v3/images/**'));

const totalSearchCount = '65043';

test('Can use text input', async ({ page }) => {
  await mockRoute({
    page,
    path: '**/image-api/v3/images/?exclude-revision-log=false&fallback=false&filter-inactive=true&include-other-statuses=false&page=*&page-size=10&query=Test&sort=-relevance*',
    fixture: 'search_image_query_search',
    overrideValue: imageCopyrightMock,
  });
  await page.locator('input[name="query"]').fill('Test');
  await page.getByRole('button', { name: 'Søk', exact: true }).click();
  await page.getByTestId('image-search-result').first().waitFor();
  expect(await page.getByTestId('searchTotalCount').innerText()).toEqual('399');
  await page.locator('input[name="query"]').clear();
  await page.getByRole('button', { name: 'Søk', exact: true }).click();
  await page.getByTestId('image-search-result').first().waitFor();
  expect(await page.getByTestId('searchTotalCount').innerText()).toEqual(totalSearchCount);
});

test('Can use model released dropdown', async ({ page }) => {
  await mockRoute({
    page,
    path: '**/image-api/v3/images/?exclude-revision-log=false&fallback=false&filter-inactive=true&include-other-statuses=false&model-released=yes&page=*&page-size=10&sort=-relevance',
    fixture: 'search_image_model_released_search',
    overrideValue: imageCopyrightMock,
  });
  await page.locator('select[name="model-released"]').selectOption({ index: 1 });
  await page.getByTestId('image-search-result').first().waitFor();
  expect(await page.getByTestId('searchTotalCount').innerText()).toEqual('693');
  await page.locator('select[name="model-released"]').selectOption({ index: 0 });
  await page.getByTestId('image-search-result').first().waitFor();
  expect(await page.getByTestId('searchTotalCount').innerText()).toEqual(totalSearchCount);
});

test('Can use language dropdown', async ({ page }) => {
  await mockRoute({
    page,
    path: '**/image-api/v3/images/?exclude-revision-log=false&fallback=false&filter-inactive=true&include-other-statuses=false&language=nb&page=*&page-size=10&sort=-relevance',
    fixture: 'search_image_lang_search',
    overrideValue: imageCopyrightMock,
  });
  await page.locator('select[name="language"]').selectOption({ index: 1 });
  await page.getByTestId('image-search-result').first().waitFor();
  expect(await page.getByTestId('searchTotalCount').innerText()).toEqual('22135');
  await page.locator('select[name="language"]').selectOption({ index: 0 });
  await page.getByTestId('image-search-result').first().waitFor();
  expect(await page.getByTestId('searchTotalCount').innerText()).toEqual(totalSearchCount);
});

test('Can use license dropdown', async ({ page }) => {
  await mockRoute({
    page,
    path: '**/image-api/v3/images/?exclude-revision-log=false&fallback=false&filter-inactive=true&include-other-statuses=false&license=CC0-1.0&page=*&page-size=10&sort=-relevance',
    fixture: 'search_image_license_search',
    overrideValue: imageCopyrightMock,
  });
  await page.locator('select[name="license"]').selectOption({ index: 1 });
  await page.getByTestId('image-search-result').first().waitFor();
  expect(await page.getByTestId('searchTotalCount').innerText()).toEqual('814');
  await page.locator('select[name="license"]').selectOption({ index: 0 });
  await page.getByTestId('image-search-result').first().waitFor();
  expect(await page.getByTestId('searchTotalCount').innerText()).toEqual(totalSearchCount);
});