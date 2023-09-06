/**
 * Copyright (c) 2023-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { test, expect } from '@playwright/test';
import { mockRoute, mockWaitResponse } from '../apiMock';
import { responsiblesMock, userDataMock, zendeskMock } from '../mockResponses';

test.beforeEach(async ({ page }) => {
  const allVersions = mockRoute({
    page,
    path: '**/taxonomy/v1/versions',
    fixture: 'taxonomy_all_versions',
  });

  const draftIds = mockRoute({
    page,
    path: '**/draft-api/v1/draft-ids?fallback=true&ids=*',
    fixture: 'taxonomy_draft_ids',
  });

  const subjects = mockRoute({
    page,
    path: '**/taxonomy/v1/nodes?*',
    fixture: 'taxonomy_all_subjects',
  });

  const subjectTopics = mockRoute({
    page,
    path: '**/taxonomy/v1/nodes/*/nodes?*',
    fixture: 'taxonomy_all_subjects_topics',
  });

  const zendeskToken = mockRoute({
    page,
    path: '**/get_zendesk_token?*',
    fixture: 'taxonomy_get_zendesk',
    overrideValue: JSON.stringify(zendeskMock),
  });

  const userData = mockRoute({
    page,
    path: '**/draft-api/v1/user-data',
    fixture: 'taxonomy_user_data',
    overrideValue: JSON.stringify({
      ...userDataMock,
      favoriteSubjects: ['urn:subject:1:c8d6ed8b-d376-4c7b-b73a-3a1d48c3a357'],
    }),
  });

  const responsibles = mockRoute({
    page,
    path: '**/get_responsibles?*',
    fixture: 'taxonomy_responsibles',
    overrideValue: JSON.stringify(responsiblesMock),
  });

  await page.goto('/structure');

  await Promise.all([
    allVersions,
    draftIds,
    subjects,
    subjectTopics,
    zendeskToken,
    userData,
    responsibles,
  ]);
});

test('should have settingsMenu available after clicking button', async ({ page }) => {
  await page.getByTestId('structure').waitFor();
  await page
    .getByTestId('structure')
    .getByRole('button', { name: '1-jonas-testfag', exact: true })
    .click();
  await page.getByTestId('settings-button').click();
  expect(await page.getByTestId('settings-menu-modal').count()).toEqual(1);
  await mockWaitResponse(page, '**/**');
});

test('should be able to change name of node', async ({ page }) => {
  await page.getByTestId('structure').waitFor();
  await page
    .getByTestId('structure')
    .getByRole('button', { name: '1-jonas-testfag', exact: true })
    .click();
  await mockRoute({
    page,
    path: '**/taxonomy/v1/nodes/*/translations',
    fixture: 'taxonomy_change_name_translations_add',
  });
  await mockRoute({
    page,
    path: '**/taxonomy/v1/nodes/*/translations/nb',
    fixture: 'taxonomy_change_name_translations_nb_put',
  });
  await page.getByTestId('settings-button').click();
  await page.getByTestId('changeNodeNameButton').click();
  await page.getByTestId('edit-node-name-form').waitFor();
  expect(await page.getByTestId('edit-node-name-form').count()).toEqual(1);
  await page.getByTestId('subjectName_nb').clear();
  await page.getByTestId('subjectName_nb').fill('Nytt navn');
  await page.getByTestId('saveNodeTranslationsButton').click();
  expect(await page.getByTestId('subjectName_nb').count()).toEqual(1);
  await mockWaitResponse(page, '**/**');
});

test('should be able to delete name of node', async ({ page }) => {
  await mockRoute({
    page,
    path: '**/taxonomy/v1/nodes/*/translations',
    fixture: 'taxonomy_change_name_translations_delete',
    overrideValue: JSON.stringify([{ name: '1-jonas-testfag', language: 'nb' }]),
  });
  await mockRoute({
    page,
    path: '**/taxonomy/v1/nodes/*/translations/nb',
    fixture: 'taxonomy_change_name_translations_nb_delete',
  });
  await page.getByTestId('structure').waitFor();
  await page
    .getByTestId('structure')
    .getByRole('button', { name: '1-jonas-testfag', exact: true })
    .click();
  await page.getByTestId('settings-button').click();
  await page.getByTestId('changeNodeNameButton').click();
  await page.getByTestId('edit-node-name-form').waitFor();
  expect(await page.getByTestId('edit-node-name-form').count()).toEqual(1);
  await page.getByTestId('subjectName_nb_delete').click();
  await page.getByTestId('saveNodeTranslationsButton').click();
  expect(await page.getByTestId('subjectName_nb').count()).toEqual(0);
  await mockWaitResponse(page, '**/**');
});

test('should be able to change visibility', async ({ page }) => {
  await mockRoute({
    page,
    path: '**/taxonomy/v1/nodes/*/metadata',
    fixture: 'taxonomy_change_visibility',
    overrideValue: JSON.stringify({
      grepCodes: ['ASD'],
      visible: false,
      customFields: {
        subjectLMA: '0H0fXRPcQq1momWfKNOzmTTT',
      },
    }),
  });

  await page
    .getByTestId('structure')
    .getByRole('button', { name: '1-jonas-testfag', exact: true })
    .click();
  await page.getByTestId('settings-button').click();
  await page.getByTestId('toggleVisibilityButton').click();
  expect(await page.locator('button[id="switch-visible"]').count()).toEqual(1);
  expect(await page.locator('button[id="switch-visible"]').isChecked()).toBeTruthy();
});

test('can toggle favourites', async ({ page }) => {
  const favouriteButton = page
    .locator('div[id="urn:subject:1:c8d6ed8b-d376-4c7b-b73a-3a1d48c3a357"]')
    .getByTestId('favourite-subject');
  await favouriteButton.waitFor();
  await mockRoute({
    page,
    path: '**/draft-api/v1/user-data',
    fixture: 'taxonomy_user_data_patch',
    overrideValue: (_) =>
      JSON.stringify({
        ...userDataMock,
        favoriteSubjects: ['urn:subject:1:c8d6ed8b-d376-4c7b-b73a-3a1d48c3a357'],
      }),
  });
  expect(await favouriteButton.count()).toEqual(1);
  await favouriteButton.click();
  expect((await page.waitForResponse('**/draft-api/v1/user-data')).ok()).toBeTruthy();
});

test('can only toggle only show favourites', async ({ page }) => {
  await page.getByTestId('structure').waitFor();
  expect(await page.getByTestId('switch-favorites').isChecked()).toBeFalsy();
  expect(await page.getByTestId('structure').locator('div').count()).toEqual(556);
  await page.getByTestId('switch-favorites').click();
  expect(await page.getByTestId('switch-favorites').isChecked()).toBeTruthy();
  await page.getByTestId('structure').waitFor();
  expect(
    await page
      .getByTestId('structure')
      .locator('div[id="urn:subject:1:c8d6ed8b-d376-4c7b-b73a-3a1d48c3a357"]')
      .count(),
  ).toEqual(1);
});
